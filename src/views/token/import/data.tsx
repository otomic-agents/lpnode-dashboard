import { FormSchema } from '/@/components/Form';

export const step1Schemas: FormSchema[] = [
  
];
export const chainSchema = {
  field: 'chain',
  component: 'Select',
  label: 'chain',
  required: true,
  defaultValue: '',
  componentProps: {
    options: [
    ],
  },
  colProps: {
    span: 24,
  },
}

export const step2Schemas: FormSchema[] = [
  {
    field: 'address',
    component: 'Input',
    label: 'Token Address',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
    // ,defaultValue: "aaa"
  },

  {
    field: 'token_name',
    component: 'Input',
    label: 'Token Name',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },

  {
    field: 'market_name',
    component: 'Input',
    label: 'Market Name',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },

  {
    field: 'precision',
    component: 'InputNumber',
    label: 'Precision',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },

  {
    field: 'type',
    component: 'Select',
    label: 'Coin Type',
    required: true,
    defaultValue: 'coin',
    componentProps: {
      options: [
        {
          label: 'Stable Coin',
          value: 'stable_coin'
        },
        {
          label: 'Coin',
          value: 'coin'
        }
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 230
  }
];


export const step2SchemasNear: FormSchema[] = [
  {
    field: 'address',
    component: 'Input',
    label: 'Token Create Receipt',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'token_id',
    component: 'Input',
    label: 'Token Address',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'token_name',
    component: 'Input',
    label: 'Token Name',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },

  {
    field: 'market_name',
    component: 'Input',
    label: 'Market Name',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },

  {
    field: 'precision',
    component: 'InputNumber',
    label: 'Precision',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },

  {
    field: 'type',
    component: 'Select',
    label: 'Coin Type',
    required: true,
    defaultValue: 'coin',
    componentProps: {
      options: [
        {
          label: 'Stable Coin',
          value: 'stable_coin'
        },
        {
          label: 'Coin',
          value: 'coin'
        }
      ],
    },
    colProps: {
      span: 24,
    },
    labelWidth: 230
  }
];