import { BasicForm, FormSchema, useForm } from '/@/components/Form';
export const formSchemas: FormSchema[] = [
    {
        field: 'name',
        label: 'Rule Name',
        component: 'Input',
        required: true,
        componentProps: {
            placeholder: 'Enter a unique rule name',
            maxlength: 50,
        },
        rules: [
            { required: true, message: 'Please enter a rule name' },
            { max: 50, message: 'Rule name cannot exceed 50 characters' },
        ],
    },
    {
        field: 'description',
        label: 'Description',
        component: 'InputTextArea',
        componentProps: {
            placeholder: 'Describe what this rule monitors',
            rows: 2,
            maxlength: 200,
        },
        rules: [
            { max: 200, message: 'Description cannot exceed 200 characters' },
        ],
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
        rules: [
            { required: true, message: 'Please select a severity level' },
        ],
    },
    {
        field: 'expression',
        label: 'Expression',
        component: 'Input', 
        slot: 'expressionSlot',
        defaultValue: 'return data.cpu_usage;',
        rules: [
            { required: true, message: 'Please enter an expression' },
        ],
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
        rules: [
            { required: true, message: 'Please select a condition' },
        ],
    },
    {
        field: 'threshold',
        label: 'Threshold',
        component: 'Input', // Using regular input field that accepts any type of input
        defaultValue: '80', // Default value set as string
        componentProps: {
            style: { width: '100%' },
            allowClear: true,
            placeholder: 'Enter threshold value (string, number, or boolean)',
        },
        rules: [
            { required: true, message: 'Please enter a threshold value' },
            {
                validator: (_, value) => {
                    // If input is empty, pass validation (required rule will handle this case)
                    if (value === undefined || value === null || value === '') {
                        return Promise.resolve();
                    }

                    // Check if value is string, number or boolean
                    const valueType = typeof value;
                    const isStringOrNumber = valueType === 'string' || valueType === 'number';
                    const isBoolean = valueType === 'boolean' || value === 'true' || value === 'false';

                    if (isStringOrNumber || isBoolean) {
                        return Promise.resolve();
                    }

                    return Promise.reject('Threshold must be a string, number, or boolean value');
                }
            }
        ],
    },
    {
        field: 'suppressionMinutes',
        label: 'Suppression',
        component: 'InputNumber',
        defaultValue: 15,
        componentProps: {
            style: { width: '100%' },
            min: 0,
            step: 1,
            addonAfter: 'minutes',
        },
        helpMessage: 'Time to wait before sending another alert for this rule',
        rules: [
            { required: true, message: 'Please enter suppression time' },
            // Removed { min: 0, message: 'Suppression time cannot be negative' } rule
            { type: 'number', message: 'Suppression time must be a number' },
        ],
    },
];
