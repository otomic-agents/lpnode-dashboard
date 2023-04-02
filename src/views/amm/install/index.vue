<template>
  <PageWrapper
    title="Install Amm Program"
    contentBackground
    content=" type 'amm program' will be link with 'bridge' to control swap flow "
    contentClass="p-4"
  >
    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="Select type" />
        <a-step title="Enter information" />
        <a-step title="congratulations" />
      </a-steps>
    </div>
    <div class="mt-5">
      <Step1 @next="handleStep1Next" v-show="current === 0" />
      <Step2
        @prev="handleStepPrev"
        @next="handleStep2Next"
        v-show="current === 1"
        v-if="initSetp2"
      />
      <Step3 v-show="current === 2" @redo="handleRedo" v-if="initSetp3" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { installAmm } from '/@/api/lpnode/amm';

  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Step1,
      Step2,
      Step3,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },
    setup() {
      const current = ref(0);

      let type = 'amm'

      const state = reactive({
        initSetp2: false,
        initSetp3: false,
      });

      function handleStep1Next(step1Values: any) {

        if (step1Values.type == 'amm_program') {
          type = 'amm'
        }
        else if (step1Values.type == 'market_price_program') {
          type = 'market'
        } else if (step1Values.type == 'index_program') {
          type = 'index'
        } else {
          type = 'index'
        } 

        current.value++;
        state.initSetp2 = true;
        console.log(step1Values);
      }

      function handleStepPrev() {
        current.value--;
      }

      async function handleStep2Next(step2Values: any) {

        let envArray = []
        let i = 0
        while(step2Values[`envKey${i}`]) {
          envArray.push({
            'key': step2Values[`envKey${i}`],
            'value': step2Values[`envValue${i}`]
          })
          i++
        }

        let resp = await installAmm({
          setupConfig: {
            imageRepository: step2Values.image,
            install: true,
            containerPort: step2Values.port0 + '',
            installType: type,
            customEnv: envArray,
            name: step2Values.name
          }
        })

        console.log('resp:')
        console.log(resp)

        if(resp != undefined) {
          current.value++;
          state.initSetp3 = true;
        }
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp2 = false;
        state.initSetp3 = false;
      }

      return {
        current,
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
