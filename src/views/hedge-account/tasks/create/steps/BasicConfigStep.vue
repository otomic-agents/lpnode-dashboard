<template>
    <div>
        <h3 class="step-title">Step 1: Select Basic Configuration</h3>

        <div class="form-container">
            <div class="form-item">
                <label class="required-label">Task Name</label>
                <a-input v-model:value="formData.name" placeholder="Enter task name" class="form-input" />
            </div>

            <div class="form-row">
                <div class="form-item half-width">
                    <label class="required-label">Bridge</label>
                    <a-select v-model:value="formData.bridge_id" placeholder="Select bridge" class="form-input">
                        <a-select-option v-for="option in bridgeOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </div>

                <div class="form-item half-width">
                    <label class="required-label">CEX Account</label>
                    <a-select v-model:value="formData.cex_account_id" placeholder="Select CEX account"
                        class="form-input">
                        <a-select-option v-for="option in cexAccountOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-item half-width">
                    <label class="required-label">AMM App</label>
                    <a-select v-model:value="formData.amm_name" placeholder="Select AMM app" class="form-input">
                        <a-select-option v-for="option in ammOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Input, Select } from 'ant-design-vue';

interface SelectOption {
    value: string;
    label: string;
}
export default defineComponent({
    name: 'BasicConfigStep',
    components: {
        AInput: Input,
        ASelect: Select,
        ASelectOption: Select.Option
    },
    props: {
        formData: {
            type: Object,
            required: true
        },
        bridgeOptions: {
            type: Array as () => SelectOption[],
            required: true
        },
        cexAccountOptions: {
            type: Array as () => SelectOption[],
            required: true
        },
        ammOptions: {
            type: Array as () => SelectOption[],
            required: true
        }
    }
});
</script>

<style scoped>
.step-title {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
}

.form-container {
    width: 100%;
}

.form-item {
    margin-bottom: 20px;
    width: 100%;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.half-width {
    width: 50%;
}

.form-input {
    width: 100%;
}

.required-label::before {
    content: "* ";
    color: #ff4d4f;
}
</style>