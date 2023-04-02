import { FormSchema } from '/@/components/Form';

export const step1Schemas: FormSchema[] = [
  {
    field: 'chain',
    component: 'Select',
    label: 'Chain',
    required: true,
    defaultValue: 'BSC',
    componentProps: {
      options: [
        {
          label: 'BSC',
          value: 'BSC',
        },
        {
          label: 'AVAX',
          value: 'AVAX',
        },
        {
          label: 'XRP',
          value: 'XRP',
        },
        {
          label: 'NEAR',
          value: 'NEAR',
        },
      ],
    },
    colProps: {
      span: 24,
    },
  },
];

export const step2SchemasBSC: FormSchema[] = [
  {
    field: 'rpc',
    component: 'Input',
    label: 'BSC RPC URL',
    required: true,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
  {
    field: 'start_block',
    component: 'InputNumber',
    label: 'Start Block Number',
    required: false,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
  {
    field: 'image',
    component: 'Input',
    label: 'Docker Image',
    required: false,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
];

export const step2SchemasAVAX: FormSchema[] = [
  {
    field: 'rpc',
    component: 'Input',
    label: 'AVAX RPC URL',
    required: true,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
  {
    field: 'start_block',
    component: 'InputNumber',
    label: 'Start Block Number',
    required: false,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
  {
    field: 'image',
    component: 'Input',
    label: 'Docker Image',
    required: false,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
];

export const step2SchemasNEAR: FormSchema[] = [
  {
    field: 'rpc',
    component: 'Input',
    label: 'NEAR RPC URL',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'image',
    component: 'Input',
    label: 'Docker Image',
    required: false,
    defaultValue: '',
    labelWidth: 230,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'wallet_url',
    component: 'Input',
    label: 'NEAR Connection Wallet URL',
    required: false,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'helper_url',
    component: 'Input',
    label: 'NEAR Connection Helper URL',
    required: false,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'explorer_url',
    component: 'Input',
    label: 'NEAR Connection Explorer URL',
    required: false,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'aws_access',
    component: 'Input',
    label: 'AWS Access Key ID',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'aws_secret',
    component: 'Input',
    label: 'AWS Secret Access Key',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'start_block',
    component: 'InputNumber',
    label: 'Start Block Number',
    required: false,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
];

export const step2SchemasXRP: FormSchema[] = [
  {
    field: 'rpc',
    component: 'Input',
    label: 'XRP RPC URL',
    required: true,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
  {
    field: 'start_block',
    component: 'InputNumber',
    label: 'Start Block Number',
    required: false,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
  {
    field: 'image',
    component: 'Input',
    label: 'Docker Image',
    required: false,
    defaultValue: '',
    labelWidth: 200
    // colProps: {
    //   span: 24,
    // },
  },
];