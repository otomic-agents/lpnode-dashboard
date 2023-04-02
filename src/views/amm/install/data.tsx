import { FormSchema } from '/@/components/Form';

export const step1Schemas: FormSchema[] = [
  {
    field: 'type',
    component: 'Select',
    label: 'type',
    required: true,
    defaultValue: 'amm_program',
    componentProps: {
      options: [
        {
          label: 'Amm Program',
          value: 'amm_program',
        },
        {
          label: 'Index Program',
          value: 'index_program',
        },
        {
          label: 'Market Price Program',
          value: 'market_price_program',
        },
      ],
    },
    colProps: {
      span: 24,
    },
  },
];

export const step2Schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: 'name',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'image',
    component: 'Input',
    label: 'image',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'port0',
    component: 'InputNumber',
    label: 'port0',
    required: false,
    defaultValue: '',
    colProps: {
      span: 24,
    },
  }
];

export const portItem = {
  field: 'port',
  component: 'InputNumber',
  label: 'port',
  required: false,
  defaultValue: '',
  colProps: {
    span: 24,
  },
}

export const envKeyItem = {
  field: 'envKey',
  component: 'Input',
  label: 'envKey',
  required: false,
  defaultValue: '',
  colProps: {
    span: 24,
  },
}

export const envValueItem = {
  field: 'envValue',
  component: 'Input',
  label: 'envValue',
  required: false,
  defaultValue: '',
  colProps: {
    span: 24,
  },
}