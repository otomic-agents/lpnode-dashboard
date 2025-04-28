<template>
    <PageWrapper title="Create Hedge Account">
        <a-card class="hedge-account-create">
            <a-form :model="formState" :rules="formRules" ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-item label="Account Name" name="name">
                    <a-input v-model:value="formState.name" placeholder="Enter account name" />
                </a-form-item>

                <a-form-item label="Exchange" name="exchange">
                    <a-select v-model:value="formState.exchange" placeholder="Select exchange">
                        <a-select-option value="binance">Binance</a-select-option>
                        <a-select-option value="okx">OKX</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="API Key" name="api_key">
                    <a-input v-model:value="formState.api_key" placeholder="Enter API key" />
                </a-form-item>

                <a-form-item label="API Secret" name="api_secret">
                    <a-input-password v-model:value="formState.api_secret" placeholder="Enter API secret" />
                </a-form-item>

                <a-form-item label="Passphrase" name="passphrase" v-if="needsPassphrase">
                    <a-input-password v-model:value="formState.passphrase"
                        placeholder="Enter passphrase (if required)" />
                    <div class="form-item-help">Only required for some exchanges like OKX</div>
                </a-form-item>

                <a-form-item :wrapper-col="{ offset: 6, span: 14 }">
                    <a-space>
                        <a-button type="primary" @click="handleSubmit" :loading="submitting">Create Account</a-button>
                        <a-button @click="goToList">Cancel</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>
    </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { PageWrapper } from '/@/components/Page';
import { Card, Form, Input, Select, Button, Space, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { createHedgeAccount } from '/@/api/lpnode/hedge_account';
import type { CreateHedgeAccountParams } from '/@/api/lpnode/model/hedgeAccountModel';
import type { Rule } from 'ant-design-vue/es/form';
export default defineComponent({
    name: 'HedgeAccountCreate',
    components: {
        PageWrapper,
        ACard: Card,
        AForm: Form,
        AFormItem: Form.Item,
        AInput: Input,
        AInputPassword: Input.Password,
        ASelect: Select,
        ASelectOption: Select.Option,
        AButton: Button,
        ASpace: Space,
    },
    setup() {
        const router = useRouter();
        const formRef = ref();
        const submitting = ref(false);

        const formState = reactive<CreateHedgeAccountParams>({
            name: '',
            exchange: '',
            api_key: '',
            api_secret: '',
            passphrase: '',
        });
        const labelCol = { span: 6 };
        const wrapperCol = { span: 14 };
        const formRules = reactive({
            name: [{ required: true, message: 'Please enter account name', trigger: 'blur' }] as Rule[],
            exchange: [{ required: true, message: 'Please select exchange', trigger: 'change' }] as Rule[],
            api_key: [{ required: true, message: 'Please enter API key', trigger: 'blur' }] as Rule[],
            api_secret: [{ required: true, message: 'Please enter API secret', trigger: 'blur' }] as Rule[],
            passphrase: [] as Rule[],
        });

        const needsPassphrase = computed(() => {
            return formState.exchange === 'okx';
        });

        const handleSubmit = async () => {
            try {
                await formRef.value.validate();
                submitting.value = true;

                const params: CreateHedgeAccountParams = {
                    name: formState.name,
                    exchange: formState.exchange,
                    api_key: formState.api_key,
                    api_secret: formState.api_secret,
                };

                if (needsPassphrase.value && formState.passphrase) {
                    params.passphrase = formState.passphrase;
                }

                const res = await createHedgeAccount(params);

                if (res.code === 0) {
                    message.success('Hedge account created successfully');
                    router.push('/hedge-account/list');
                } else {
                    message.error(res.message || 'Failed to create hedge account');
                }
            } catch (error) {
                console.error('Validation or submission error:', error);
            } finally {
                submitting.value = false;
            }
        };

        const goToList = () => {
            router.push('/hedge-account/list');
        };

        return {
            formRef,
            formState,
            formRules,
            labelCol,
            wrapperCol,
            submitting,
            needsPassphrase,
            handleSubmit,
            goToList,
        };
    },
});
</script>

<style lang="less" scoped>
.hedge-account-create {
    max-width: 800px;
    margin: 0 auto;

    .form-item-help {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 4px;
    }
}
</style>