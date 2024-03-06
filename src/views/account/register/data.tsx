import { FormSchema } from '/@/components/Form';

export const step2Schemas: FormSchema[] = [
  // {
  //   field: 'name',
  //   component: 'Input',
  //   label: 'Account Name',
  //   required: true,
  //   defaultValue: '',
  //   colProps: {
  //     span: 24,
  //   },
  //   labelWidth: 230
  // },
  {
    field: 'profile',
    component: 'Input',
    label: 'Profile',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
];
