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
    <Loading :loading="isLoading" />
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
  import { Loading } from '/@/components/Loading/index';
  import { useTabs } from '/@/hooks/web/useTabs';

  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Loading,
      Step1,
      Step2,
      Step3,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },
    setup() {
      const current = ref(0);
      const isLoading = ref(false);
      const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();

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

        isLoading.value = true

        let params: any = {
          "walletName": step2Values.wallet_name,
	        "chainType": getChainType(data.chain.toLowerCase()),
	        "chainId": getChainID(data.chain.toLowerCase())
        }

     
        Object.assign(params, {
          "privateKey": step2Values.private_key,
          "address": step2Values.address == undefined ? step2Values.account_id : step2Values.address,
          "accountId": step2Values.account_id,
          "walletType": "privateKey",
          "signServiceEndpoint": step2Values.sign_service_endpoint
        })
        
        let resp = await createWallet(params);
        if (resp != undefined) {
          current.value++;
          state.initSetp3 = true;
        }

        isLoading.value = false
        refreshPage()
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp2 = false;
        state.initSetp3 = false;
      }

      return {
        data,
        current,
        isLoading,
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
