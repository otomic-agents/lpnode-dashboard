<template>
  <PageWrapper :class="prefixCls" title="Alert Rules">
    <div :class="`${prefixCls}__container`">
      <div :class="`${prefixCls}__create-section`">
        <a-button type="primary" :class="`${prefixCls}__create-btn`" @click="handleCreateRule">
          <Icon icon="material-symbols:add" :class="`${prefixCls}__create-icon`" />
          Create Rule
        </a-button>
      </div>

      <a-list>
        <template v-for="item in rulesList" :key="item.name">
          <a-list-item>
            <a-card :class="`${prefixCls}__card`" :bordered="false" :hoverable="true">
              <div :class="`${prefixCls}__card-header`">
                <h3 :class="`${prefixCls}__title`">
                  <Icon icon="material-symbols:rule-settings" :class="`${prefixCls}__title-icon`" />
                  {{ item.name }}
                </h3>
                <div :class="`${prefixCls}__tags`">
                  <Tag :class="`${prefixCls}__tag`" :color="getSeverityColor(item.severity)">
                    {{ item.severity }}
                  </Tag>
                  <Tag :class="`${prefixCls}__tag`" color="blue">
                    Threshold: {{ item.condition }} {{ item.threshold }}
                  </Tag>
                  <Tag :class="`${prefixCls}__tag`" color="purple">
                    Suppression: {{ item.suppressionMinutes }} min
                  </Tag>
                </div>
              </div>

              <div :class="`${prefixCls}__description`">
                {{ item.description }}
              </div>

              <div :class="`${prefixCls}__expression`">
                <div :class="`${prefixCls}__expression-header`">
                  <Icon icon="mdi:function" :class="`${prefixCls}__expression-icon`" />
                  Expression
                </div>
                <div :class="`${prefixCls}__expression-content`">
                  <pre>{{ formatExpression(item.expression) }}</pre>
                  <a-button type="text" :class="`${prefixCls}__copy-btn`" @click="copyToClipboard(item.expression)">
                    <Icon icon="material-symbols:content-copy-outline" />
                  </a-button>
                </div>
              </div>

              <div :class="`${prefixCls}__action`">
                <a-button type="primary" danger ghost :class="`${prefixCls}__action-btn`"
                  @click="handleDeleteRule(item)">
                  <Icon icon="material-symbols:delete-forever" :class="`${prefixCls}__action-icon`" />
                  Delete
                </a-button>
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
      <a-empty v-if="rulesList.length === 0" :class="`${prefixCls}__empty`" description="No rules found" />
    </div>
    <Loading :loading="isLoading" />
  </PageWrapper>
</template>
<script lang="ts">
import { Tag, Tooltip, Card, Button, Empty } from 'ant-design-vue';
import { defineComponent, ref, onMounted } from 'vue';
import Icon from '/@/components/Icon/index';
import { PageWrapper } from '/@/components/Page';
import { List } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useRouter } from 'vue-router';

import { Loading } from '/@/components/Loading/index';
import { listRules, deleteRule } from '/@/api/lpnode/rules';
import { Rule } from '/@/api/lpnode/model/ruleModel';

export default defineComponent({
  components: {
    Loading,
    Icon,
    Tag,
    Tooltip,
    PageWrapper,
    ACard: Card,
    AButton: Button,
    AEmpty: Empty,
    [String(List.name)]: List,
    [String(List.Item.name)]: List.Item,
  },
  setup() {
    const router = useRouter();
    const handleCreateRule = () => {
      try {
        router.push('/monitoring/alert-rule/create');
      } catch (error) {
        console.error('Navigation failed:', error);
      }
    };
    const { createMessage } = useMessage();
    const rulesList = ref<any[]>([]);
    const isLoading = ref(false);

    const fetchRules = async () => {
      try {
        isLoading.value = true;
        const resp = await listRules();
        rulesList.value = resp || [];
      } catch (error) {
        console.error('Error fetching rules:', error);
        createMessage.error('Failed to fetch rules list');
      } finally {
        isLoading.value = false;
      }
    };

    const handleDeleteRule = async (item: Rule) => {
      try {
        isLoading.value = true;
        await deleteRule(item._id);
        createMessage.success('Rule deleted successfully');
        // Refresh the rules list after deletion
        await fetchRules();
      } catch (error) {
        console.error('Error deleting rule:', error);
        createMessage.error('Failed to delete rule');
      } finally {
        isLoading.value = false;
      }
    };

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        createMessage.success('Expression copied to clipboard');
      }).catch(() => {
        createMessage.error('Failed to copy expression');
      });
    };

    const formatExpression = (expression) => {
      return expression.trim();
    };

    const getSeverityColor = (severity) => {
      const severityColors = {
        'critical': '#f5222d',  // Red
        'error': '#fa541c',     // Orange-red
        'warning': '#faad14',   // Yellow
        'info': '#1890ff'       // Blue
      };

      return severityColors[severity.toLowerCase()] || 'default';
    };

    onMounted(() => {
      fetchRules();
    });

    return {
      handleCreateRule,
      isLoading,
      prefixCls: 'rules-list',
      rulesList,
      copyToClipboard,
      handleDeleteRule,
      formatExpression,
      getSeverityColor
    };
  },
});
</script>
<style lang="less" scoped>
.alert-rules {
  &__container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__create-section {
    background-color: #f5f7fa;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  &__create-btn {
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  &__create-icon {
    margin-right: 6px;
  }

  &__card {
    width: 100%;
    margin-bottom: 16px;
  }

  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 500;
  }

  &__title-icon {
    margin-right: 8px;
    color: #1890ff;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__description {
    margin: 12px 0;
    color: rgba(0, 0, 0, 0.65);
  }

  &__expression {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding: 12px;
    margin: 12px 0;
  }

  &__expression-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  &__expression-icon {
    margin-right: 6px;
    color: #1890ff;
  }

  &__expression-content {
    position: relative;
    background-color: #fff;
    border-radius: 4px;
    padding: 12px;
    overflow-x: auto;
  }

  &__copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  &__action {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }

  &__empty {
    margin-top: 24px;
  }
}

.rules-list {
  &__container {
    padding: 16px;
    background-color: @component-background;
    border-radius: 4px;
  }

  &__card {
    width: 100%;
    transition: all 0.3s ease;
    margin-bottom: 8px;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &-header {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 20px;
    font-weight: 600;
    color: @text-color;

    &-icon {
      margin-right: 8px;
      font-size: 24px;
      color: #1890ff;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__tag {
    margin-right: 0;
    font-size: 12px;
  }

  &__description {
    font-size: 14px;
    color: @text-color-secondary;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  &__expression {
    background-color: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 16px;
    overflow: hidden;

    &-header {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      background-color: #e6f7ff;
      border-bottom: 1px solid #91d5ff;
      font-weight: 500;
      color: #1890ff;
    }

    &-icon {
      margin-right: 8px;
    }

    &-content {
      position: relative;
      padding: 12px 16px;

      pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        white-space: pre-wrap;
        word-break: break-all;
        font-size: 13px;
        color: @text-color;
        padding-right: 30px;
      }
    }
  }

  &__copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px;

    &:hover {
      color: #1890ff;
    }
  }

  &__action {
    display: flex;
    gap: 12px;
    margin-top: 16px;

    &-btn {
      display: flex;
      align-items: center;
    }

    &-icon {
      margin-right: 4px;
    }
  }

  &__empty {
    margin: 32px 0;
  }
}
</style>