<template>
  <PageWrapper
    title="Register"
    contentBackground
    content="register LP a account"
    contentClass="p-4"
  >
    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="Enter Account Information" />
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
  import { Loading } from '/@/components/Loading/index';
  import { useTabs } from '/@/hooks/web/useTabs';

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
      const current = ref(0);
      const isLoading = ref(false);
      const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();

      const state = reactive({
        initSetp3: false,
      });

      function handleStepPrev() {
        current.value--;
      }

      async function handleStep2Next(step2Values: any) {
        isLoading.value = true
        let params: any = {

          // name: step2Values.name,
          profile: step2Values.profile
        }

        let resp = await register(params);
        if (resp != undefined) {
          current.value++;
          state.initSetp3 = true;
        }

        isLoading.value = false
        refreshPage()
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp3 = false;
      }

      return {
        isLoading,
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
