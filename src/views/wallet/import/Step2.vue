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

      let schemasPure;
      let step2EvmSchemas;
      const updateVaultData = async () => {
        if (props.ctx.chain == "bsc" || props.ctx.chain == "avax") {
          schemasPure = Object.assign([], step2Schemas)

          let resp = await vaultList({});
          console.log('resp:')
          console.log(resp)
          for (let vaultInfo of resp) {
            if(vaultInfo.secertType == "private_key" && vaultInfo.hostType == "save_secert") {
              step2SchemaVaultIds.componentProps.options.push({
                label: vaultInfo.address,
                value: vaultInfo.id
              })
            }
          }
          
          let options = schemasPure[1].componentProps.options
          schemasPure[1].componentProps = ({formModel, formActionType}) => {
            

            console.log('componentProps:')
            console.log(options)

            return {
              options: options,
              onChange: (e: any) => {
                console.log('onchange')
                console.log(e)

                step2EvmSchemas = Object.assign([], schemasPure)
                if ( e == "key" ) {
                  step2EvmSchemas.push(step2SchemaKeyAddress)
                  step2EvmSchemas.push(step2SchemaKeyPrivate)
                }
                else
                if ( e == "vault" ) {
                  step2EvmSchemas.push(step2SchemaVaultIds)
                }
                setProps({schemas: step2EvmSchemas})
              }
            }
          }

          step2EvmSchemas = Object.assign([], schemasPure)

          step2EvmSchemas.push(step2SchemaKeyAddress)
          step2EvmSchemas.push(step2SchemaKeyPrivate)

          setProps({schemas: step2EvmSchemas})
        }
      }
      updateVaultData()


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
