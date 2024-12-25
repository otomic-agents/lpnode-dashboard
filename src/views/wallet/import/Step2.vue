<template>
  <div class="step2">
    <BasicForm @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step2Schemas, step2SchemasNear, step2SchemaKeyAddress, step2SchemaKeyPrivate, step2SchemaVaultIds } from './data';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';
  import { vaultList } from '/@/api/lpnode/wallet';


  export default defineComponent({
    components: {
      BasicForm,
      [Alert.name]: Alert,
      [Divider.name]: Divider,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
    },
    props: {
      ctx: { type: Object}
    },
    emits: ['next', 'prev'],
    setup(props, { emit }) {

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
          console.log(values)
          setProps({
            submitButtonOptions: {
              loading: false,
            },
          });
          setTimeout(() => {
            setProps({
              submitButtonOptions: {
                loading: false,
              },
            });
            emit('next', values);
          }, 1);
        } catch (error) {}
      }

      return { register };
    },
  });
</script>
<style lang="less" scoped>
  .step2 {
    width: 450px;
    margin: 0 auto;
  }
</style>
