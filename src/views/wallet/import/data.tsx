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
  defaultValue: '',
  colProps: {
    span: 24,
  },
  labelWidth: 230,
  defaultValue: '0x10FE2771907B0c4245695daD7e9Ed064d45860f8'
}

export const step2SchemaKeyPrivate = {
  field: 'private_key',
  component: 'Input',
  label: 'Private Key',
  required: true,
  defaultValue: '',
  colProps: {
    span: 24,
  },
  labelWidth: 230,
  defaultValue: '058d185b433e50118a1bd451c13a7602df50b060e4a83e3b5057f5feff98fd3f'
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
    defaultValue: '',
    colProps: {
      span: 24,
    },
    labelWidth: 230,
    defaultValue: 'TestWallet1'
  },
  // {
  //   field: 'type',
  //   component: 'Select',
  //   label: 'Type',
  //   required: true,
  //   defaultValue: 'key',
  //   componentProps: {
  //     options: [
  //       {
  //         label: 'PrivateKey',
  //         value: 'key'
  //       },
  //       {
  //         label: 'Vault',
  //         value: 'vault'
  //       }
  //     ],
  //   },
  //   colProps: {
  //     span: 24,
  //   },
  //   labelWidth: 230
  // },
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