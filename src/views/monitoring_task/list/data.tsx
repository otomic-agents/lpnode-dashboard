import { FormSchema } from '/@/components/Form/index';

export const actions: any[] = [
  // { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
  // { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
  // { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
];

export const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'InputSearch',
    label: 'Token',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
  },
];
