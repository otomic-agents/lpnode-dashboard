<template>
  <PageWrapper
    title="Create"
    contentBackground
    content="create a bridge"
    contentClass="p-4"
  >
    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="Enter Bridge Information" />
        <a-step title="Congratulations" />
      </a-steps>
    </div>
    <div class="mt-5">
      <Step2
        @prev="handleStepPrev"
        @next="handleStep2Next"
        v-show="current === 0"
      />
      <Step3 v-show="current === 1" @redo="handleRedo" v-if="initSetp3" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import { PageWrapper } from '/@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { register } from '/@/api/lpnode/account';
  import { getChainID, getChainType } from '/@/obridge/utils'
  import { createBridge } from '/@/api/lpnode/bridge'

  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Step2,
      Step3,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },
    setup() {
      const current = ref(0);

      const state = reactive({
        initSetp3: false,
      });

      function handleStepPrev() {
        current.value--;
      }

      async function handleStep2Next(step2Values: any) {
        console.log('step2Values')
        console.log(step2Values)
        let params = {
          "bridgeName": step2Values.name,
          "srcChainId": step2Values.src_chain,
          "dstChainId": step2Values.dst_chain,
          "srcTokenId": step2Values.src_token.split(',')[1],
          "dstTokenId": step2Values.dst_token.split(',')[1],
          "walletId": step2Values.dst_wallet,
          "srcWalletId": step2Values.src_wallet,
          // "receiveAddress": step2Values.src_wallet,
          "ammName": step2Values.amm
        }

        let resp = await createBridge(params)
        console.log('resp:')
        console.log(resp)

        if(resp != undefined) {
          current.value++
          state.initSetp3 = true;
        }
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp3 = false;
      }

      return {
        current,
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
