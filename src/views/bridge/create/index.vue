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
    <Loading :loading="isLoading" />
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
  import { Loading } from '/@/components/Loading/index';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { restart } from '/@/api/lpnode/base';
import { ListResourceModel } from '/@/api/lpnode/model/ammModel';
import { edit, listResource } from '/@/api/lpnode/amm';

  export default defineComponent({
    name: 'FormStepPage',
    components: {
      Loading,
      Step2,
      Step3,
      PageWrapper,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },
    setup() {
      const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();
      const isLoading = ref(false)
      const current = ref(0);

      const state = reactive({
        initSetp3: false,
      });

      function handleStepPrev() {
        current.value--;
      }

      async function handleStep2Next(step2Values: any) {
        isLoading.value = true
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
          "ammName": step2Values.amm,
          "enableLimiter": step2Values.enable_limiter
        }

        try {
          let resp = await createBridge(params)
          console.log('resp:')
          console.log(resp)

          if(resp != undefined) {
            current.value++
            state.initSetp3 = true;
          }
        } catch (error) {
          console.log('error', error)
        }

        try {
          let resp = await restart({})
          console.log('resp:')
          console.log(resp)
        } catch (error) {
          console.log('error', error)
        }

        let ammRes: ListResourceModel = await listResource({})
        if (ammRes.length > 0) {
          ammRes[0].templateResult = ammRes[0].templateResult ? ammRes[0].templateResult : ammRes[0].template
          let resp = await edit(ammRes[0])
          console.log('resp:')
          console.log(resp)
        }

        isLoading.value = false
        refreshPage()
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp3 = false;
      }

      return {
        current,
        isLoading,
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
