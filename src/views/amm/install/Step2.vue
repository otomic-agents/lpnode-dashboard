<template>
  <div class="step2">
    <a-descriptions :column="1" class="mt-5">
      <!-- <a-descriptions-item > <Button type="primary" class="mr-2" color="success" @click="addPort"> Add new port </Button> </a-descriptions-item> -->
      <a-descriptions-item > <Button type="primary" color="success" @click="addEnv"> Add new env </Button> </a-descriptions-item>
    </a-descriptions>

    <BasicForm @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step2Schemas, portItem, envKeyItem, envValueItem } from './data';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';
  import { Button, ButtonProps } from '/@/components/Button';

  export default defineComponent({
    components: {
      Button,
      BasicForm,
      [Alert.name]: Alert,
      [Divider.name]: Divider,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
    },
    emits: ['next', 'prev'],
    setup(_, { emit }) {

      let schemas = step2Schemas
      let portNum = 0
      let envNum = 0

      const [register, { validate, setProps }] = useForm({
        labelWidth: 80,
        schemas: schemas,
        actionColOptions: {
          span: 14,
        },
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

      const addPort = () => {
        console.log('addPort')

        let np = Object.assign({}, portItem)
        np.field = `port${portNum}`
        np.label = `port${portNum}`
        portNum++

        let sch = Object.assign([], schemas)
        sch.push(np)

        schemas = sch

        setProps({
          schemas: schemas
        })
      }

      const addEnv = () => {
        console.log('addEnv')

        let nek = Object.assign({}, envKeyItem)
        nek.field = `envKey${envNum}`
        nek.label = `envKey${envNum}`

        let nev = Object.assign({}, envValueItem)
        nev.field = `envValue${envNum}`
        nev.label = `envValue${envNum}`

        envNum++

        let sch = Object.assign([], schemas)
        sch.push(nek)
        sch.push(nev)

        schemas = sch

        setProps({
          schemas: schemas
        })

      }

      return { register, addPort, addEnv };
    },
  });
</script>
<style lang="less" scoped>
  .step2 {
    width: 450px;
    margin: 0 auto;
  }
</style>
