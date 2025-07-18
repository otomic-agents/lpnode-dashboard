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

export const step2SchemaKeyAddress = {
  field: 'address',
  component: 'Input',
  label: 'Wallet Address',
  required: true,
  colProps: {
    span: 24,
  },
  labelWidth: 230,
  defaultValue: '0x10FE2771907B0c4245695daD7e9Ed064d45860f8',
  componentProps:{
    size: 'middle',
    style: { width: '450px' },
  }
}

export const step2SchemaKeyPrivate = {
  field: 'sign_service_endpoint',
  component: 'Input',
  label: 'Endpoint',
  required: true,
  colProps: {
    span: 24,
  },
  labelWidth: 230,
  defaultValue: 'http://192.168.1.1:19000',
  componentProps:{
    size: 'middle',
    style: { width: '300px;' },
  }
}

export const step2SchemaVaultIds = {
  field: 'vaultid',
  component: 'Select',
  label: 'Wallet Address',
  required: true,
  defaultValue: '',
  componentProps: {
    options: [],
  },
  colProps: {
    span: 24,
  },
  labelWidth: 230
}

export const step2Schemas: FormSchema[] = [
  {
    field: 'wallet_name',
    component: 'Input',
    label: 'Wallet Name',
    required: true,
    colProps: {
      span: 24,
    },
    labelWidth: 230,
    defaultValue: 'TestWallet1'
  },
  step2SchemaKeyAddress,
  step2SchemaKeyPrivate
];

export const step2SchemasNear: FormSchema[] = [
  {
    field: 'wallet_name',
    component: 'Input',
    label: 'Wallet Name',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'account_id',
    component: 'Input',
    label: 'Account ID',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
  {
    field: 'private_key',
    component: 'Input',
    label: 'Private Key',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230
  },
];