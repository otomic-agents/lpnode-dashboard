<template>
    <div class="hedge-mode-step">
        <h3 class="step-title">Step 3: Hedge Mode Configuration</h3>

        <div class="form-container">
            <!-- Hedge mode selection -->
            <div class="form-item">
                <label class="form-label">Hedge Mode</label>
                <a-select v-model:value="formData.risk_config.hedge_mode" class="form-control"
                    placeholder="Select hedge mode">
                    <a-select-option v-for="mode in hedgeModes" :key="mode.value" :value="mode.value">
                        {{ mode.label }}
                    </a-select-option>
                </a-select>
            </div>

            <div class="help-text">
                The system will automatically hedge your position based on the settings below.
            </div>

            <!-- Maximum asset exposure -->
            <div class="section-title">Maximum Asset Exposure</div>
            <div v-for="asset in exposureAssets" :key="`max-${asset}`" class="form-item">
                <label class="form-label">{{ asset }} Max Exposure</label>
                <div class="input-with-addon">
                    <a-input-number v-model:value="formData.risk_config.max_asset_exposure[asset]"
                        :precision="asset.includes('USD') ? 2 : 4" class="form-control" />
                    <span class="input-addon">{{ asset }}</span>
                </div>
            </div>

            <!-- Minimum hedge amount -->
            <div class="section-title">Minimum Hedge Amount</div>
            <div v-for="asset in exposureAssets" :key="`min-${asset}`" class="form-item">
                <label class="form-label">{{ asset }} Min Hedge</label>
                <div class="input-with-addon">
                    <a-input-number v-model:value="formData.risk_config.min_hedge_amount[asset]"
                        :precision="asset.includes('USD') ? 2 : 4" class="form-control" />
                    <span class="input-addon">{{ asset }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { InputNumber, Select, message } from 'ant-design-vue';

// Define form data interfaces
interface RiskConfig {
    hedge_mode: string;
    max_asset_exposure: Record<string, number>;
    min_hedge_amount: Record<string, number>;
}

interface FormData {
    name: string;
    bridge_id: string;
    cex_account_id: string;
    amm_name: string;
    pair: string;
    risk_config: RiskConfig;
}

interface HedgeMode {
    value: string;
    label: string;
}

export default defineComponent({
    name: 'HedgeModeStep',
    components: {
        AInputNumber: InputNumber,
        ASelect: Select,
        ASelectOption: Select.Option
    },
    props: {
        formData: {
            type: Object as () => FormData,
            required: true
        },
        exposureAssets: {
            type: Array as () => string[],
            required: true
        },
        hedgeModes: {
            type: Array as () => HedgeMode[],
            required: true,
            default: () => [{ value: 'SPOT', label: 'Spot Trading' }]
        }
    },
    setup(props, { emit, expose }) {
        // Ensure risk configuration object is initialized
        if (!props.formData.risk_config) {
            console.log("set default form_data risk_config")
            props.formData.risk_config = {
                hedge_mode: 'SPOT',
                max_asset_exposure: {},
                min_hedge_amount: {}
            };
        }

        if (!props.formData.risk_config.max_asset_exposure) {
            props.formData.risk_config.max_asset_exposure = {};
        }

        if (!props.formData.risk_config.min_hedge_amount) {
            props.formData.risk_config.min_hedge_amount = {};
        }

        const confirm = async () => {
            // Verify if hedge mode is selected
            if (!props.formData.risk_config.hedge_mode) {
                message.error('Please select a hedge mode');
                return false;
            }

            // Validate maximum asset exposure and minimum hedge amount
            let isValid = true;
            const errors: string[] = [];

            // Iterate through all assets for validation
            for (let i = 0; i < props.exposureAssets.length; i++) {
                const asset = props.exposureAssets[i];
                
                // Validate maximum asset exposure
                const maxExposure = props.formData.risk_config.max_asset_exposure[asset];
                if (maxExposure === undefined || maxExposure === null || isNaN(Number(maxExposure))) {
                    errors.push(`${asset} Max Exposure must be a valid number`);
                    isValid = false;
                } else if (Number(maxExposure) <= 0) {
                    errors.push(`${asset} Max Exposure must be greater than 0`);
                    isValid = false;
                }

                // Validate minimum hedge amount
                const minHedge = props.formData.risk_config.min_hedge_amount[asset];
                if (minHedge === undefined || minHedge === null || isNaN(Number(minHedge))) {
                    errors.push(`${asset} Min Hedge must be a valid number`);
                    isValid = false;
                } else if (Number(minHedge) <= 0) {
                    errors.push(`${asset} Min Hedge must be greater than 0`);
                    isValid = false;
                }
            }

            // If there are validation errors, display error message and return false
            if (!isValid) {
                message.error(errors.join('\n'));
                return false;
            }

            // Build risk configuration data
            const confirmData = {
                risk_config: {
                    hedge_mode: props.formData.risk_config.hedge_mode,
                    max_asset_exposure: { ...props.formData.risk_config.max_asset_exposure },
                    min_hedge_amount: { ...props.formData.risk_config.min_hedge_amount },
                }
            };

            console.log('Hedge mode configuration:', confirmData);
            emit('hedge-mode-confirm', confirmData);

            // Return true to indicate validation passed
            return true;
        };
        
        expose({
            confirm
        });
        
        return {};
    }
});
</script>

<style scoped>
.hedge-mode-step {
    padding: 20px 0;
}

.step-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 20px;
    color: #333;
}

.form-container {
    max-width: 800px;
}

.form-item {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}

.form-control {
    width: 100%;
    height: 38px;
}

.help-text {
    margin: 8px 0 20px;
    color: #666;
    font-size: 14px;
}

.section-title {
    font-weight: 500;
    margin: 24px 0 16px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
}

.input-with-addon {
    display: flex;
    align-items: center;
}

.input-addon {
    display: inline-block;
    padding: 0 11px;
    height: 38px;
    line-height: 38px;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-left: none;
    border-radius: 0 2px 2px 0;
    color: rgba(0, 0, 0, 0.65);
    white-space: nowrap;
}

.input-with-addon .form-control {
    border-radius: 2px 0 0 2px;
}
</style>
