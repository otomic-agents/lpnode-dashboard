<template>
  <div class="step2">
    <BasicForm @register="register" />
        
      <a-alert
      v-if="errorMessage"
      type="error"
      :message="errorMessage"
      class="my-3"
      closable
      @close="errorMessage = ''"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent,ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step2Schemas, step2SchemasNear } from './data';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';
  import { AddressValidator } from '/@/utils/addressValidator';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    components: {
      BasicForm,
      [String(Alert.name)]: Alert,
      [String(Divider.name)]: Divider,
      [String(Descriptions.name)]: Descriptions,
      [String(Descriptions.Item.name)]: Descriptions.Item,
    },
    props: {
      ctx: { type: Object}
    },
    emits: ['next', 'prev'],
    setup(props:any, { emit }) {
      const errorMessage = ref('');

      const [register, { validate, setProps }] = useForm({
        labelWidth: 80,
        schemas: props.ctx.chain == "near" ? step2SchemasNear : step2Schemas,
        actionColOptions: {
          span: 14,
        },
        showResetButton: false,
        submitButtonOptions: {
          text: 'next',
        },
        resetFunc: customResetFunc,
        submitFunc: customSubmitFunc,
      });



      async function customResetFunc() {
        emit('prev');
      }

      async function customSubmitFunc() {
        try {
          const values = await validate();
          
          try {
            values.address = AddressValidator.validateAddress(
              values.address,
              props.ctx.chain
            );
            
            setProps({
              submitButtonOptions: {
                loading: true,
              },
            });
            emit('next', values);
          } catch (error: any) {
            errorMessage.value = error.message;
            message.error(error.message);
          } finally {
            setProps({
              submitButtonOptions: {
                loading: false,
              },
            });
          }
        } catch (error) {
          console.error('Form validation failed:', error);
        }
      }

      return { register,errorMessage };
    },
  });
</script>
<style lang="less" scoped>
  .step2 {
    width: 650px;
    margin: 0 auto;
  }
</style>
