<template>
  <PageWrapper :class="prefixCls" title="Settings">
    <template #headerContent> </template>

    <div :class="`${prefixCls}__content`">
      <BasicForm @register="register" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { Progress, Row, Col } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { update } from '/@/api/lpnode/settings';
  export default defineComponent({
    components: {
      Icon,
      PageWrapper,
      BasicForm,
    },
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const [register, { validate, setProps, setFieldsValue }] = useForm({
        labelWidth: 80,
        schemas: {
          field: 'relayUri',
          component: 'Input',
          label: 'Relay Uri',
          required: true,
          defaultValue: '',
          colProps: {
            span: 24,
          },
          labelWidth: 230,
          // ,defaultValue: "aaa"
        },
        actionColOptions: {
          span: 14,
        },
        showResetButton: false,
        submitButtonOptions: {
          text: 'submit',
        },
        resetFunc: () => {},
        submitFunc: async () => {
          try {
            const values = await validate();
            console.log(values);
            setProps({
              submitButtonOptions: {
                loading: true,
              },
            });
            await update({
              relayUri: values.relayUri,
            });
            createMessage.success('Update success');
          } catch (error) {
            console.log(error);
          } finally {
            setProps({
              submitButtonOptions: {
                loading: false,
              },
            });
          }
        },
      });

      return {
        register,
        prefixCls: 'list-basic',
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-basic {
    &__top {
      padding: 24px;
      text-align: center;
      background-color: @component-background;

      &-col {
        &:not(:last-child) {
          border-right: 1px dashed @border-color-base;
        }

        div {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 22px;
          color: @text-color;
        }

        p {
          margin: 0;
          font-size: 24px;
          line-height: 32px;
          color: @text-color;
        }
      }
    }

    &__content {
      padding: 24px;
      margin-top: 12px;
      background-color: @component-background;

      .list {
        position: relative;
      }

      .icon {
        font-size: 40px !important;
      }

      .extra {
        position: absolute;
        top: 20px;
        right: 15px;
        font-weight: normal;
        color: @primary-color;
        cursor: pointer;
      }

      .description {
        display: inline-block;
        width: 40%;
      }

      .info {
        display: inline-block;
        width: 30%;
        text-align: center;

        div {
          display: inline-block;
          padding: 0 20px;

          span {
            display: block;
          }
        }
      }

      .progress {
        display: inline-block;
        width: 15%;
        vertical-align: top;
      }
    }
  }
</style>
