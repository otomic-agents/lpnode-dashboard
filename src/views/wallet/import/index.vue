<template>
  <PageWrapper
    title="Import Wallet"
    contentBackground
    content="config receiving wallet and sender wallet"
    contentClass="p-4"
  >
    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="Choose Chain" />
        <a-step title="Enter Wallet Information" />
        <a-step title="Congratulations" />
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
  import { createWallet } from '/@/api/lpnode/wallet';
  import { getChainID, getChainType } from '/@/obridge/utils'

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
        data.chain = step1Values.chain
        current.value++;
        state.initSetp2 = true;
        console.log(step1Values);
      }

      function handleStepPrev() {
        current.value--;
      }

      async function handleStep2Next(step2Values: any) {
        let params: any = {
          "walletName": step2Values.wallet_name,
	        "privateKey": step2Values.private_key,
	        "address": step2Values.address == undefined ? step2Values.account_id : step2Values.address,
          "accountId": step2Values.account_id,
	        "chainType": getChainType(data.chain.toLowerCase()),
	        "chainId": getChainID(data.chain.toLowerCase())
        }

        let resp = await createWallet(params);
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
