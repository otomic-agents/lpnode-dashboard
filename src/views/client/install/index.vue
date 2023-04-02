<template>
  <PageWrapper
    title="Install"
    contentBackground
    content="You need to install the chainclient of the two chains of collection and payment to monitor and send transactions."
    contentClass="p-4"
  >

    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="choose chain" />
        <a-step title="config" />
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
        :ctx="data"
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
  import { installChainClient } from '/@/api/lpnode/chainclient';

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

      const data = reactive({
        chain: ''
      })

      const state = reactive({
        initSetp2: false,
        initSetp3: false,
      });

      function handleStep1Next(step1Values: any) {
        current.value++;
        data.chain = step1Values.chain
        state.initSetp2 = true;
        console.log(step1Values);
      }

      function handleStepPrev() {
        current.value--;
      }

      async function handleStep2Next(step2Values: any) {

        console.log(step2Values);
        let params: any = {
          type: data.chain.toLowerCase(),
        }
        if (step2Values.rpc){
          if (params.type == 'NEAR'){
            params.connectionNodeurl = step2Values.rpc
          } else {
            params.rpcUrl = step2Values.rpc
          }
        }
        if (step2Values.start_block && step2Values.start_block !== "") {
          params.startBlock = step2Values.start_block + ""
        }
        if (step2Values.image && step2Values.image !== ""){
          params.imageRepository = step2Values.image
        }

        if (step2Values.wallet_url && step2Values.wallet_url !== ""){
          params.connectionWalleturl = step2Values.wallet_url
        }
        if (step2Values.helper_url && step2Values.helper_url !== ""){
          params.connectionHelperurl = step2Values.helper_url
        }
        if (step2Values.explorer_url && step2Values.explorer_url !== ""){
          params.connectionExplorerurl = step2Values.explorer_url
        }
        if (step2Values.aws_access){
          params.awsAccessKeyId = step2Values.aws_access
        }
        if (step2Values.aws_secret){
          params.awsSecretAccessKey = step2Values.aws_secret
        }
        params.install = true

        let resp = await installChainClient({setupConfig: params})
        console.log(resp)
        if (resp != undefined) {
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
        data,
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
