<template>
  <div class="step1">
    <div class="step1-form">
      <BasicForm @register="register">
        
      </BasicForm>
    </div>
    <a-divider />

  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step1Schemas, chainSchema } from './data';
  import { list } from '/@/api/lpnode/base';
  import { ListModel } from '/@/api/lpnode/model/baseModel';

  import { Select, Input, Divider } from 'ant-design-vue';
  export default defineComponent({
    components: {
      BasicForm,
      [Select.name]: Select,
      ASelectOption: Select.Option,
      [Input.name]: Input,
      [Input.Group.name]: Input.Group,
      [Divider.name]: Divider,
    },
    emits: ['next'],
    setup(_, { emit }) {
      const [register, { validate, setProps }] = useForm({
        labelWidth: 100,
        schemas: step1Schemas,
        actionColOptions: {
          span: 14,
        },
        showResetButton: false,
        submitButtonOptions: {
          text: 'next',
        },
        submitFunc: customSubmitFunc,
      });

      async function customSubmitFunc() {
        try {
          const values = await validate();
          emit('next', values);
        } catch (error) {}
      }

      const syncData = async () => {
        let resp: ListModel = await list({
          installType: 'ammClient'
        })


        let options = []
        resp.forEach(element => {
          options.push({
            label: element.name,
            value: element.name
          })
        });

        let newSchema = Object.assign([], step1Schemas)
        newSchema.push(chainSchema)

        newSchema[0].componentProps.options = options
        newSchema[0].defaultValue = options[0].value
        console.log('resp')
        console.log(resp)
        console.log(newSchema)

        setProps({
          schemas: newSchema
        })

      }
      syncData()

      return { register };
    },
  });
</script>
<style lang="less" scoped>
  .step1 {
    &-form {
      width: 450px;
      margin: 0 auto;
    }

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 32px;
      color: @text-color;
    }

    h4 {
      margin: 0 0 4px;
      font-size: 14px;
      line-height: 22px;
      color: @text-color;
    }

    p {
      color: @text-color;
    }
  }

  .pay-select {
    width: 20%;
  }

  .pay-input {
    width: 70%;
  }
</style>
