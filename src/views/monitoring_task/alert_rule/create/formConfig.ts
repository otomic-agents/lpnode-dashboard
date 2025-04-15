export const formConfig:any = {
    labelWidth: 150, 
    schemas: [
      {
        field: 'name',
        label: 'Rule Name',
        component: 'Input',
        required: true,
        colProps: { span: 24 },
      },
      {
        field: 'description',
        label: 'Description',
        component: 'InputTextArea',
        colProps: { span: 24 },
      },
      {
        field: 'severity',
        label: 'Severity',
        component: 'RadioButtonGroup',
        defaultValue: 'warning',
        componentProps: {
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Warning', value: 'warning' },
            { label: 'Critical', value: 'critical' },
          ],
        },
        required: true,
        colProps: { span: 24 },
      },
    
      {
        field: 'metricsReference',
        label: 'Metrics Reference',
        component: 'Input',
        slot: 'metricsReferenceSlot',
        colProps: { span: 24 },
      },
      {
        field: 'expression',
        label: 'Expression',
        component: 'Input',
        slot: 'expressionSlot',
        required: true,
        colProps: { span: 24 },
      },
      {
        field: 'condition',
        label: 'Condition',
        component: 'Select',
        defaultValue: '>',
        componentProps: {
          options: [
            { label: 'Greater than (>)', value: '>' },
            { label: 'Greater than or equal (>=)', value: '>=' },
            { label: 'Less than (<)', value: '<' },
            { label: 'Less than or equal (<=)', value: '<=' },
            { label: 'Equal (==)', value: '==' },
            { label: 'Not equal (!=)', value: '!=' },
          ],
        },
        required: true,
        colProps: { span: 24 },
      },
      {
        field: 'threshold',
        label: 'Threshold',
        component: 'InputNumber',
        required: true,
        colProps: { span: 24 },
      },
      {
        field: 'suppressionMinutes',
        label: 'Suppression',
        component: 'InputNumber',
        componentProps: {
          addonAfter: 'minutes',
          min: 0,
        },
        required: true,
        colProps: { span: 24 },
      },
    ],
    showResetButton: false,
    showSubmitButton: false,
    actionColOptions: { span: 24 },
    baseColProps: { span: 24 },
  }