<template>
  <PageWrapper title="Create" contentBackground content="create a bridge" contentClass="p-4">
    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="Input script" @click="handleRedo" />
        <a-step title="Wait for execution result" />
        <a-step title="Complementary information" />
      </a-steps>
    </div>
    <div class="mt-5">
      <Step1 @next="handleStep1Next" v-show="current === 0" />

      <div v-if="showResult == true">
        <h2>Results</h2>
        <CodeEditor v-model:value="executeResult" :mode="modeValue" />
      </div>
    </div>
    <Step2 v-show="current === 1" @prev="handleStepPrev" @next="handleStep2Next" v-if="initSetp2" />
    <Step3
      v-show="current === 2"
      @prev="handleStep3Prev"
      @save="handleSaveScript"
      v-if="initSetp3"
    /> </PageWrapper
></template>
<script lang="ts">
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { run, runResult, scriptAdd } from '/@/api/lpnode/monitoring';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { createState } from './global_state';
  export default defineComponent({
    name: 'FormStepPage',
    components: {
      CodeEditor,
      Step1,
      Step2,
      Step3,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },
    setup() {
      const modeValue = ref<MODE>(MODE.JSON);
      const { createMessage } = useMessage();
      const current = ref(0);
      let resultTimer: NodeJS.Timer;
      let isRequest = false;
      const state = reactive({
        executeResult: '',
        showResult: false,
        initSetp2: false,
        initSetp3: false,
        createState,
      });

      const handleSaveScript = async (data) => {
        console.log('handleSaveScript:', data);
        const addRes: any = await scriptAdd({
          scriptBody: data.code,
          name: data.name,
          cron: data.cron,
        });
        console.log('res:');
        console.log(addRes);
        if (addRes !== undefined) {
          current.value = 0;
          createMessage.success('save script sucees');
          state.executeResult = '';
          state.showResult = false;
          state.initSetp2 = false;
          state.initSetp3 = false;
        }
      };
      const getRunResult = (scriptName) => {
        resultTimer = setInterval(async () => {
          let res: any = await runResult({
            scriptName,
          });
          console.log('res:');
          console.log(res);
          if (res != undefined && res !== 'not fount') {
            clearInterval(resultTimer);
            isRequest = false;
            state.executeResult = res;
            state.showResult = true;
            createState.runComplete = true;

            createMessage.success('Script execution complete');
          }
        }, 2000);
        setTimeout(() => {
          if (isRequest === true) {
            createMessage.error('Script execution timed out');
          }
          if (resultTimer) {
            clearInterval(resultTimer);
          }
        }, 1000 * 60);
      };
      const runUserScript = async (step1Values) => {
        console.log(step1Values);
        isRequest = true;
        state.executeResult = '';
        state.showResult = false;
        createState.code = step1Values.editValue;
        const res = await run({
          scriptContent: step1Values.editValue,
        });
        if (res != undefined) {
          createMessage.success('Script submitted successfully');
          getRunResult(res);
        }
      };

      function handleStepPrev() {
        console.log('handleStepPrev', '🧲🧲🧲🧲🧲🧲');
        // state.executeResult = '';
        // state.showResult = false;
        current.value--;
      }
      function handleStep3Prev() {
        state.showResult = true;
        state.initSetp2 = true;
        current.value--;
      }
      function handleStep1Next(step1Values: any) {
        runUserScript(step1Values);
        createState.runComplete = false;
        current.value++;
        state.initSetp2 = true;
      }
      function handleStep2Next(step2Values: any) {
        console.log(step2Values);
        current.value++;
        state.showResult = false;
        state.initSetp2 = false;
        state.initSetp3 = true;
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp2 = false;
        state.initSetp3 = false;
      }

      return {
        current,
        modeValue,
        handleSaveScript,
        handleStep3Prev,
        handleStep1Next,
        handleStep2Next,
        handleRedo,
        handleStepPrev,
        ...toRefs(state),
      };
    },
  });
</script>
<style lang="less" scoped>
  .step-form-content {
    padding: 24px;
    background-color: @component-background;
  }

  .step-form-form {
    width: 750px;
    margin: 0 auto;
  }
</style>
