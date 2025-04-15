<template>
  <PageWrapper :class="prefixCls" title="Create Alert Rule">
    <div :class="`${prefixCls}__container`">
      <BasicForm @register="registerForm" @submit="handleSubmit">
        <!-- Metrics Reference Panel -->
        <template #metricsReferenceSlot="{ }">
          <div :class="`${prefixCls}__metrics-reference`">
            <div :class="`${prefixCls}__metrics-reference-header`">
              <span>Available Metrics Reference</span>
            </div>
            <a-spin :spinning="metricsLoading">
              <div class="metrics-scroll-container">
                <a-collapse v-model:activeKey="activeMetricKeys">
                  <a-collapse-panel 
                    v-for="metric in metrics" 
                    :key="metric.name" 
                    :header="`${metric.name}`"
                  >
                    <div :class="`${prefixCls}__metric-item`">
                      <div :class="`${prefixCls}__metric-name`">
                        <a-button type="link" size="small" @click="copyToClipboard(metric.name)">
                          <Icon icon="material-symbols:content-copy-outline" />
                          Copy name
                        </a-button>
                      </div>
                      
                      <div v-if="hasLabels(metric)" :class="`${prefixCls}__metric-labels`">
                        <div :class="`${prefixCls}__metric-labels-header`">Labels:</div>
                        <div 
                          v-for="(values, labelName) in metric.availableLabels" 
                          :key="labelName"
                          :class="`${prefixCls}__metric-label-item`"
                        >
                          <div :class="`${prefixCls}__metric-label-name`">
                            <span>- {{ labelName }}:</span>
                            <a-button type="link" size="small" @click="copyToClipboard(labelName)">
                              <Icon icon="material-symbols:content-copy-outline" />
                              Copy
                            </a-button>
                          </div>
                          <div :class="`${prefixCls}__metric-label-values`">
                            <span>Values:</span>
                            <a-space wrap>
                              <a-tag 
                                v-for="value in values" 
                                :key="value"
                                :class="`${prefixCls}__metric-label-value`"
                              >
                                {{ value }}
                                <a-button type="link" size="small" @click.stop="copyToClipboard(value)">
                                  <Icon icon="material-symbols:content-copy-outline" />
                                </a-button>
                              </a-tag>
                            </a-space>
                          </div>
                        </div>
                      </div>
                      <div v-else :class="`${prefixCls}__metric-no-labels`">
                        Labels: None
                      </div>
                      <div :class="`${prefixCls}__metric-example`">
                        <div :class="`${prefixCls}__metric-example-header`">Example:</div>
                        <div :class="`${prefixCls}__metric-example-code`">
                          <code>getLatestMetric('{{ metric.name }}'{{ hasLabels(metric) ? ', {' : '' }}{{ formatLabelsExample(metric.availableLabels) }}{{ hasLabels(metric) ? '}' : '' }})</code>
                          <a-button type="link" size="small" @click="copyToClipboard(`getLatestMetric('${metric.name}'${hasLabels(metric) ? ', {' + formatLabelsExample(metric.availableLabels) + '}' : ''})`)">
                            <Icon icon="material-symbols:content-copy-outline" />
                            Copy
                          </a-button>
                        </div>
                      </div>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </div>
            </a-spin>
          </div>
        </template>

        <!-- Code Editor -->
        <template #expressionSlot="{ }">
          <div :class="`${prefixCls}__code-editor-container`">
            <div ref="codeEditorRef" :class="`${prefixCls}__code-editor`"></div>
            <div :class="`${prefixCls}__code-editor-hint`">
              <Icon icon="mdi:information-outline" />
              Write JavaScript expression that returns a numeric value to be evaluated
            </div>
          </div>
        </template>

        <!-- Form Buttons -->
        <template #formFooter="{ }">
          <a-space>
            <a-button type="primary" @click="handleSubmit" :loading="isSubmitting">
              <Icon icon="material-symbols:save" :class="`${prefixCls}__btn-icon`" />
              Create Rule
            </a-button>
            <a-button @click="handleCancel">
              <Icon icon="material-symbols:cancel" :class="`${prefixCls}__btn-icon`" />
              Cancel
            </a-button>
          </a-space>
        </template>
      </BasicForm>
    </div>
    <Loading :loading="isLoading" />
  </PageWrapper>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { PageWrapper } from '/@/components/Page';
import { BasicForm, useForm } from '/@/components/Form';
import { useMessage } from '/@/hooks/web/useMessage';
import { useRouter } from 'vue-router';
import { Icon } from '/@/components/Icon';
import Loading from '/@/components/Loading/src/Loading.vue';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { indentUnit } from '@codemirror/language';
import { bracketMatching } from '@codemirror/language';
import { createRule } from '/@/api/lpnode/rules';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { customCompletions } from './customCompletions';
import { getAllMetrics } from '/@/api/lpnode/metrics';
import { closeBrackets, autocompletion } from '@codemirror/autocomplete';
import { themeConfig } from './themeConfig';
import { Highlighting } from './highlighting';

const prefixCls = 'create-rule';
const codeEditorRef = ref(null);
const router = useRouter();
const tabStore = useMultipleTabStore();
const { createMessage, createErrorModal } = useMessage();
const isLoading = ref(false);
const isSubmitting = ref(false);
const metrics:any = ref([]);
const metricsLoading = ref(false);
const activeMetricKeys:any = ref([]);

let editorView:any = null;

const ruleForm = reactive({
  name: '',
  description: '',
  severity: 'warning',
  expression: `getLatestMetric('chain-client-evm-bsc-9006-monitor:block_height', {block_type: 'latest_block'})`,
  condition: '>',
  threshold: 80,
  suppressionMinutes: 15,
});

const [registerForm, { validate, setFieldsValue, getFieldsValue }] = useForm({
  labelWidth: 150,
  schemas: [
    {
      field: 'name',
      label: 'Rule Name',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'description',
      label: 'Description',
      component: 'InputTextArea',
      colProps: { span: 24 },
    },
    {
      field: 'severity',
      label: 'Severity',
      component: 'RadioButtonGroup',
      defaultValue: 'warning',
      componentProps: {
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warning' },
          { label: 'Critical', value: 'critical' },
        ],
      },
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'metricsReference',
      label: 'Metrics Reference',
      component: 'Input',
      slot: 'metricsReferenceSlot',
      colProps: { span: 24 },
    },
    {
      field: 'expression',
      label: 'Expression',
      component: 'Input',
      slot: 'expressionSlot',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'condition',
      label: 'Condition',
      component: 'Select',
      defaultValue: '>',
      componentProps: {
        options: [
          { label: 'Greater than (>)', value: '>' },
          { label: 'Greater than or equal (>=)', value: '>=' },
          { label: 'Less than (<)', value: '<' },
          { label: 'Less than or equal (<=)', value: '<=' },
          { label: 'Equal (==)', value: '==' },
          { label: 'Not equal (!=)', value: '!=' },
        ],
      },
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'threshold',
      label: 'Threshold',
      component: 'InputNumber',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'suppressionMinutes',
      label: 'Suppression',
      component: 'InputNumber',
      componentProps: {
        addonAfter: 'minutes',
        min: 0,
      },
      required: true,
      colProps: { span: 24 },
    },
  ],
  showResetButton: false,
  showSubmitButton: false,
  actionColOptions: { span: 24 },
  baseColProps: { span: 24 },
});

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    createMessage.success('Copied to clipboard');
  }).catch(err => {
    createMessage.error('Copy failed: ' + (err.message || 'Unknown error'));
  });
};

const hasLabels = (metric) => {
  return metric.availableLabels && Object.keys(metric.availableLabels).length > 0;
};

const formatLabelsExample = (labels) => {
  if (!labels || Object.keys(labels).length === 0) return '';
  return Object.entries(labels)
    .map(([key, values]:[any,any]) => `${key}: '${values[0]}'`)
    .join(', ');
};

const fetchMetrics = async () => {
  metricsLoading.value = true;
  try {
    const response:any = await getAllMetrics();
    if (response && Array.isArray(response)) {
      metrics.value = response;
      if (metrics.value.length > 0) {
        activeMetricKeys.value = [metrics.value[0].name];
      }
    } else if (response && response.metrics && Array.isArray(response.metrics)) {
      metrics.value = response.metrics;
      if (metrics.value.length > 0) {
        activeMetricKeys.value = [metrics.value[0].name];
      }
    } else {
      console.error('Invalid API response format:', response);
      createMessage.error('Failed to get metrics: Invalid response format');
    }
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    //@ts-ignore
    createMessage.error('Failed to get metrics: ' + (error.message || 'Unknown error'));
  } finally {
    metricsLoading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    await validate();
    isSubmitting.value = true;
    const formValues = getFieldsValue();
    const formData:any = {
      ...formValues,
      expression: ruleForm.expression,
    };

    if (!formData.expression || formData.expression.trim() === '') {
      createMessage.error('Expression cannot be empty');
      isSubmitting.value = false;
      return;
    }

    await createRule(formData);
    createMessage.success('Alert rule created successfully');
    router.push('/monitoring/alert-rule/list');
  } catch (error) {
    console.error('Failed to create alert rule:', error);
    createErrorModal({
      title: 'Error',
      content: 'Failed to create alert rule. Please check your inputs and try again.'
    });
  } finally {
    isSubmitting.value = false;
  }
};

function myCompletions(context) {
  const word = context.matchBefore(/[\w\.$]+/);
  if (!word || (word.from === word.to && !context.explicit)) return null;
  
  const text = word.text.toLowerCase();
  const filtered = customCompletions.filter(item =>
    item.label.toLowerCase().includes(text)
  );
  
  if (filtered.length === 0) return null;
  
  return {
    from: word.from,
    options: filtered.map(item => ({
      label: item.label,
      type: item.type,
      info: item.info,
      detail: item.detail,
      apply: item.apply || item.label
    }))
  };
}

const initCodeEditor = () => {
  if (!codeEditorRef.value) return;

  const startState = EditorState.create({
    doc: ruleForm.expression,
    extensions: [
      keymap.of([...defaultKeymap, indentWithTab]),
      javascript(),
      syntaxHighlighting(defaultHighlightStyle),
      bracketMatching(),
      closeBrackets(),
      indentUnit.of("  "),
      autocompletion({
        override: [myCompletions],
        defaultKeymap: true,
        icons: true
      }),
      EditorView.theme(themeConfig),
      EditorView.theme(Highlighting),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          ruleForm.expression = update.state.doc.toString();
          setFieldsValue({ expression: ruleForm.expression });
        }
      })
    ]
  });

  editorView = new EditorView({
    state: startState,
    parent: codeEditorRef.value
  });
};

const handleCancel = () => {
  tabStore.closeTabByKey(router.currentRoute.value.fullPath, router);
  router.push('/monitoring/alert-rule/list');
};

onMounted(() => {
  fetchMetrics();
  nextTick(initCodeEditor);
});

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy();
    editorView = null;
  }
});
</script>

<style lang="less" scoped>
.create-rule {
  &__container {
    background-color: #fff;
    padding: 24px;
    border-radius: 2px;
  }

  &__metrics-reference {
    margin-bottom: 16px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    background-color: #fff;
  }

  &__metrics-reference-header {
    padding: 12px 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #d9d9d9;
    font-weight: 500;
  }

  .metrics-scroll-container {
    max-height: 300px;
    overflow-y: auto;
    padding: 12px 16px;
  }

  &__metric-item {
    padding: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  &__metric-label-item {
    margin-left: 24px;
    margin-bottom: 8px;
  }

  &__metric-example-code {
    margin-left: 24px;
    background-color: #f5f5f5;
    padding: 8px;
    border-radius: 2px;
  }

  &__code-editor-container {
    position: relative;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    overflow: hidden;
    background-color: #fff;
    margin-bottom: 16px;
  }

  &__code-editor {
    width: 100%;
    min-height: 200px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
  }

  &__code-editor-hint {
    padding: 8px;
    background-color: #f5f5f5;
    border-top: 1px solid #d9d9d9;
    color: #666;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__btn-icon {
    margin-right: 6px;
  }
}

:deep(.ant-form-item-label) {
  text-align: left;
}

:deep(.ant-collapse-content-box) {
  padding: 0 !important;
}
</style>

