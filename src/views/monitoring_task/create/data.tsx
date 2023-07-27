import { FormSchema } from '/@/components/Form';

export const step2Schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: 'Name',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 120,
  },
  {
    field: 'corn',
    component: 'Input',
    label: 'Corn',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 120,
  },
  {
    field: 'user_script',
    component: 'Upload',
    label: 'Userscript',
    required: true,
    defaultValue: '',

    componentProps: {
      api: () => {
        return 'http://baidu.com';
      },
      maxNumber: 1,
    },
    colProps: {
      span: 24,
    },
    labelWidth: 120,
  },
];
