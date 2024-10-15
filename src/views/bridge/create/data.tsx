import { FormSchema } from '/@/components/Form';

export const step2Schemas: FormSchema[] = [
  {
    field: 'amm',
    component: 'Select',
    label: 'AMM',
    required: true,
    defaultValue: '',
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 260
  },
  
  {
    field: 'name',
    component: 'Input',
    label: 'Name',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 260
  },
  {
    field: 'enable_limiter',
    component: 'Switch',
    label: 'Open AuthenticationLimiter',
    required: true,
    defaultValue: true,
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 260,
  },
  {
    field: 'relay',
    component: 'Select',
    label: 'relay',
    required: true,
    defaultValue: '',
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 260
  },
];

export const step2SchemasSrc: FormSchema[] = [
  {
    field: 'src_chain',
    component: 'Select',
    label: 'SRC Chain',
    required: true,
    defaultValue: '',
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 120,
    // changeEvent: 'srcchain'
  },
  {
    field: 'src_token',
    component: 'Select',
    label: 'SRC Token',
    required: true,
    defaultValue: '',
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 120
  },
  {
    field: 'src_wallet',
    component: 'Select',
    label: 'SRC Wallet',
    required: true,
    defaultValue: '',
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 120
  },
];

export const step2SchemasDst: FormSchema[] = [
  {
    field: 'dst_chain',
    component: 'Select',
    label: 'DST Chain',
    required: true,
    defaultValue: '',
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 120
  },
  {
    field: 'dst_token',
    component: 'Select',
    label: 'DST Token',
    required: true,
    defaultValue: '',
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 120
  },
  {
    field: 'dst_wallet',
    component: 'Select',
    label: 'DST Wallet',
    required: true,
    defaultValue: '',
    componentProps: {
      options: [
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 120
  },
];
