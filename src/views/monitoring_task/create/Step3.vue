<template>
  <BasicForm @register="register" />
</template>

<script lang="ts">
  import { FormSchema } from '/@/components/Form';
  const colProps = {
    span: 8,
  };
  export const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: 'Name',
      colProps,
      componentProps: {
        placeholder: 'Name',
      },
      required: true,
    },
    {
      field: 'cron',
      component: 'Input',
      label: 'Cron',
      colProps,
      componentProps: {
        placeholder: '0,5,10,15,20,25,30,35,40,45,50,55 * * * *',
      },
      required: true,
    },
  ];
  import { BasicForm, useForm } from '/@/components/Form';
  import { defineComponent } from 'vue';
  import { createState } from './global_state';
  export default defineComponent({
    name: 'FormBasicPage',
    components: { BasicForm },
    emits: ['prev', 'save'],
    setup(_, { emit }) {
      const save = (form_data) => {
        Object.assign(form_data, { code: createState.code });
        emit('save', form_data);
      };
      const [register, { validate }] = useForm({
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 15,
        },
        schemas: schemas,
        actionColOptions: {
          offset: 8,
          span: 23,
        },
        resetButtonOptions: {
          text: 'Prev',
        },
        resetFunc: async () => {
          emit('prev');
        },
        submitButtonOptions: {
          text: 'Save And Deploy',
        },
        submitFunc: async () => {
          const result = await validate();
          save(result);
        },
      });
      return {
        register,
      };
    },
  });
</script>
