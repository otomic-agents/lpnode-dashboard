<template>
  <div class="step2">

    <BasicForm @register="register"/>
  </div>
</template>
<script lang="ts">
  import { defineComponent, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step2SchemasBSC, step2SchemasAVAX, step2SchemasNEAR, step2SchemasXRP } from './data';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';

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

      let schema// = props.ctx.chain == 'BSC' ? step2SchemasBSC
      let newSchema = () => {
        switch (props.ctx.chain) {
          case 'BSC':
            schema = step2SchemasBSC
            break;
          case 'AVAX':
            schema = step2SchemasAVAX
            break;
          case 'NEAR':
            schema = step2SchemasNEAR
            break;
          case 'XRP':
            schema = step2SchemasXRP
            break;
          default:
            break;
        }
      }
      newSchema()

      const [register, { validate, setProps }] = useForm({
        labelWidth: 80,
        schemas: schema,
        actionColOptions: {
          span: 14,
        },
        // resetButtonOptions: {
        //   text: '上一步',
        // },
        showResetButton: false,
        submitButtonOptions: {
          text: 'confirm',
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
          setProps({
            submitButtonOptions: {
              loading: true,
            },
          });
          setTimeout(() => {
            setProps({
              submitButtonOptions: {
                loading: false,
              },
            });
            emit('next', values);
          }, 1500);
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
