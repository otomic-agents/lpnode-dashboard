<template>
    <PageWrapper :title="isEditMode ? 'Edit Hedge Task' : 'Create Hedge Task'">
        <a-spin :spinning="isEditMode && loading" tip="Loading task data...">
            <div class="hedge-task-container">
                <a-steps :current="currentStep" class="mb-6">
                    <a-step title="Basic Configuration" />
                    <a-step title="Balance Confirmation" />
                    <a-step title="Hedge Mode" />
                    <a-step title="Review & Submit" />
                </a-steps>

                <div class="step-content-container">
                    <BasicConfigStep v-if="currentStep === 0" :formData="formData" :bridgeOptions="bridgeOptions"
                        :cexAccountOptions="cexAccountOptions" :ammOptions="ammOptions" />
                    <BalanceConfirmationStep
                        v-if="currentStep === 1 && selectedBridge && selectedHedgeAccount && tokenData"
                        ref="balanceConfirmationRef" :balances="balances" :selectedBridge="selectedBridge"
                        :selectedHedgeAccount="selectedHedgeAccount" :tokensList="tokenData"
                        @confirm-balances="handleBalancesConfirmed" @refresh="refreshBalances" />
                    <HedgeModeStep v-if="currentStep === 2" :formData="formData" :exposureAssets="bridgeTokens"
                        ref="hedgeModeRef" @hedge-mode-confirm="handleHedgeModeConfirmed"
                        :hedgeModes="[{ value: 'SPOT', label: 'Spot Trading' }]" />
                    <ReviewSubmitStep v-if="currentStep === 3" :formData="formData" :getBridgeName="getBridgeName"
                        :getCexAccountName="getCexAccountName" />
                </div>

                <!-- Navigation Buttons -->
                <div class="step-actions">
                    <a-button v-if="currentStep > 0" @click="prev" class="mr-2">
                        Previous
                    </a-button>
                    <a-button v-if="currentStep < 3" type="primary" @click="next" :disabled="!isStepValid(currentStep)">
                        Next
                    </a-button>
                    <a-button v-if="currentStep === 3" type="primary" @click="submitForm">
                        Create Task
                    </a-button>
                </div>
            </div>
        </a-spin>
    </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { PageWrapper } from '/@/components/Page';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import { list as getBridgeList } from "/@/api/lpnode/bridge"
import { list as getTokenList } from "/@/api/lpnode/token"
import { TokenInfo } from '/@/api/lpnode/model/tokenModel';
import { BridgeInfo } from '/@/api/lpnode/model/bridgeModel';
import BasicConfigStep from './steps/BasicConfigStep.vue';
import BalanceConfirmationStep from './steps/BalanceConfirmationStep.vue';
import HedgeModeStep from './steps/HedgeModeStep.vue';
import ReviewSubmitStep from './steps/ReviewSubmitStep.vue';
import { HedgeAccount } from '/@/api/lpnode/model/hedgeAccountModel';
import { listHedgeAccounts, createHedgeTask, getHedgeTask, saveHedgeData } from '/@/api/lpnode/hedge_account';
import { listAmm } from "/@/api/lpnode/base"
import { watch } from 'vue';

interface BridgeOption {
    value: string;
    label: string;
}
interface CexAccountOption {
    value: string;
    label: string;
}
interface AmmListOption {
    value: string
    label: string
}
const chainIdToName: Record<number, string> = {
    9006: 'BSC',
    501: 'Solana',
    614: 'Optimism',
};
export default defineComponent({
    name: 'CreateHedgeTask',
    components: {
        PageWrapper,
        BasicConfigStep,
        BalanceConfirmationStep,
        HedgeModeStep,
        ReviewSubmitStep
    },
    setup() {
        const balanceConfirmationRef = ref<any>(null);
        const hedgeModeRef = ref<any>(null);
        const initialBalances = ref<any>({})
        const createdHedgeId = ref<String>('')
        const router = useRouter();
        const currentStep = ref(0);
        const taskId = ref('');
        const loading = ref(true);
        const selectedHedgeAccount = ref<HedgeAccount | null>(null);
        const selectedBridge = ref<BridgeInfo | null>(null);

        const bridgeData = ref<BridgeInfo[]>([]);
        const tokenData = ref<TokenInfo[]>([]);
        const bridgeOptions = ref<BridgeOption[]>([]);
        const cexAccountData = ref<HedgeAccount[]>([]);
        const cexAccountOptions = ref<CexAccountOption[]>([])
        const ammOptions = ref<AmmListOption[]>([])
        const route = useRoute();
        const editId = route.query.id as string;
        const isEditMode = computed(() => !!editId);

        const bridgeTokens = computed(() => {
            if (!selectedBridge.value) {
                console.warn('🚨 NO BRIDGE SELECTED!');
                return [];
            }

            // Find source token and destination token information
            const srcToken = tokenData.value.find(t => t._id === selectedBridge.value?.srcTokenId);
            const dstToken = tokenData.value.find(t => t._id === selectedBridge.value?.dstTokenId);

            // Get token names, use default values if not found
            const srcTokenName = srcToken ? srcToken.tokenName : 'UNKNOWN';
            const dstTokenName = dstToken ? dstToken.tokenName : 'UNKNOWN';

            // Use eye-catching log format
            console.log('%c 🔥🔥🔥 BRIDGE TOKENS 🔥🔥🔥', 'background: #ff0000; color: #ffffff; font-size: 20px; font-weight: bold; padding: 5px;');
            console.log('%c Source Token:', 'color: #00ff00; font-size: 16px; font-weight: bold;', srcTokenName);
            console.log('%c Destination Token:', 'color: #0000ff; font-size: 16px; font-weight: bold;', dstTokenName);
            console.log('%c Selected Bridge:', 'color: #ff00ff; font-size: 16px; font-weight: bold;', selectedBridge.value);
            console.log('%c Token IDs:', 'color: #ffff00; background: #000000; font-size: 16px; font-weight: bold;', {
                srcTokenId: selectedBridge.value?.srcTokenId,
                dstTokenId: selectedBridge.value?.dstTokenId
            });
            console.log('%c Found Tokens:', 'color: #00ffff; background: #000000; font-size: 16px; font-weight: bold;', {
                srcToken,
                dstToken
            });
            return [...new Set([srcTokenName, dstTokenName])];
        });
        // Function to build bridgeOptions
        const buildBridgeOptions = (bridges: BridgeInfo[], tokens: TokenInfo[]): BridgeOption[] => {
            // Create a mapping from token ID to token object for easy lookup
            const tokenMap = tokens.reduce((map, token) => {
                map[token._id] = token;
                return map;
            }, {} as Record<string, TokenInfo>);

            // Create an option for each bridge
            return bridges.map(bridge => {
                const srcToken = tokenMap[bridge.srcTokenId];
                const dstToken = tokenMap[bridge.dstTokenId];

                // If the corresponding token cannot be found, use ID as a substitute
                const srcTokenName = srcToken ? srcToken.tokenName : bridge.srcTokenId;
                const dstTokenName = dstToken ? dstToken.tokenName : bridge.dstTokenId;

                // Get source chain and destination chain names
                const srcChainName = chainIdToName[bridge.srcChainRawId] || `Chain-${bridge.srcChainRawId}`;
                const dstChainName = chainIdToName[bridge.dstChainRawId] || `Chain-${bridge.dstChainRawId}`;

                // Build label: bridgeName srcChainName-dstChainName (srcTokenName-dstTokenName) srcAddress-dstAddress
                const label = `${bridge.bridgeName} ${srcChainName}-${dstChainName} (${srcTokenName}-${dstTokenName}) ${bridge.srcToken.substring(0, 8)}...${bridge.dstToken.substring(0, 8)}...`;
                formData.pair = `${srcTokenName}-${dstTokenName}`
                return {
                    value: bridge._id,
                    label
                };
            });
        };

        // Function to load data
        const loadData = async () => {
            loading.value = true;
            const hedgeAccounts = await listHedgeAccounts();
            cexAccountData.value = hedgeAccounts;
            console.log("hedgeAccounts", hedgeAccounts)
            hedgeAccounts.map((item) => {
                cexAccountOptions.value.push({
                    value: item.id,
                    label: item.name
                })
            })

            const ammListData = await listAmm({ installType: "amm" })
            console.log("ammListData:", ammListData)
            ammListData.map((it) => {
                ammOptions.value.push({
                    value: it.name,
                    label: it.name,
                })
            })
            // Use Promise.all to load bridge and token data in parallel
            Promise.all([
                getBridgeList({}),
                getTokenList({})
            ])
                .then(([bridgeResponse, tokenResponse]) => {
                    bridgeData.value = bridgeResponse;
                    tokenData.value = tokenResponse;

                    console.log("bridgeData:", bridgeResponse);
                    console.log("tokenInfo:", tokenResponse);

                    if (bridgeData.value.length > 0 && tokenData.value.length > 0) {
                        bridgeOptions.value = buildBridgeOptions(bridgeData.value, tokenData.value);
                        console.log("bridgeOptions:", bridgeOptions.value);
                    }
                })
                .catch(error => {
                    console.error("Error loading data:", error);
                    message.error('Failed to load bridge and token data');
                })
                .finally(() => {
                    if (!isEditMode.value) {
                        loading.value = false;
                    }

                });
        };
        const handleBalancesConfirmed = (confirmedBalances) => {
            console.log('Balances confirmed:', confirmedBalances);

            // Store confirmed initial balances for subsequent steps
            initialBalances.value = confirmedBalances;
            currentStep.value++;
        };
        const handleHedgeModeConfirmed = (confirmedHedgeMode: { risk_config: any }) => {
            console.log(confirmedHedgeMode)
            formData.risk_config = confirmedHedgeMode.risk_config
            currentStep.value++;
        }
        // Load data after component is mounted
        onMounted(async () => {
            await loadData();
            if (isEditMode.value) {
                await loadTaskData(editId);
            }

        });
        const loadTaskData = async (id: string) => {
            // createdHedgeId.value =id;
            setTimeout(() => {
                createdHedgeId.value = id;
            })
            loading.value = true;
            try {
                loading.value = true;
                const task = await getHedgeTask(id);

                // Add very eye-catching log output
                console.log('%c===== HEDGE TASK API RESPONSE =====', 'background: #ff0000; color: #ffffff; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;');
                console.log('%cTask Data:', 'color: #ff0000; font-size: 16px; font-weight: bold;');
                console.log(task);
                console.log('%c=====================================', 'background: #ff0000; color: #ffffff; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;');

                if (task) {
                    // Fill form data
                    formData.name = task.name;
                    formData.bridge_id = task.bridge_id;
                    formData.cex_account_id = task.account_id; // Note: This may need to be adjusted according to the actual return field
                    formData.amm_name = task.amm_name;

                    message.success('Task data loaded successfully');
                } else {
                    console.error('%cNO TASK DATA RETURNED!', 'background: #ff0000; color: #ffffff; font-size: 24px; font-weight: bold; padding: 15px; border-radius: 5px;');
                    message.error('Failed to load task data');
                    router.push('/hedge/tasks');
                }
            } catch (error) {
                console.error('%c===== ERROR LOADING TASK =====', 'background: #ff0000; color: #ffffff; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;');
                console.error(error);
                console.error('%c=============================', 'background: #ff0000; color: #ffffff; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;');

                message.error('Failed to load task data');
                router.push('/hedge/tasks');
            } finally {
                loading.value = false;
            }
        };

        // Form data
        const formData = reactive({
            name: '',
            bridge_id: '',
            cex_account_id: '',
            amm_name: '',
            pair: '',
            risk_config: {
                max_asset_exposure: {

                },
                min_hedge_amount: {

                },
            },
        });

        watch(() => formData.bridge_id, (newBridgeId) => {
            if (newBridgeId && bridgeData.value.length > 0) {
                // Find the corresponding bridge object by ID
                const bridge = bridgeData.value.find(b => b._id === newBridgeId);
                if (bridge) {
                    selectedBridge.value = bridge;
                    console.log("Selected bridge:", bridge);
                } else {
                    selectedBridge.value = null;
                    console.warn(`Bridge with ID ${newBridgeId} not found`);
                }
            } else {
                selectedBridge.value = null;
            }
        });

        watch(() => formData.cex_account_id, (newAccountId) => {
            if (newAccountId && cexAccountData.value.length > 0) {
                // Find the corresponding hedge account object by ID
                const account = cexAccountData.value.find(a => a.id === newAccountId);
                if (account) {
                    selectedHedgeAccount.value = account;
                    console.log("Selected hedge account:", account);
                } else {
                    selectedHedgeAccount.value = null;
                    console.warn(`Hedge account with ID ${newAccountId} not found`);
                }
            } else {
                selectedHedgeAccount.value = null;
            }
        });

        watch(() => bridgeData.value, (newBridgeData) => {
            if (formData.bridge_id && newBridgeData.length > 0) {
                const bridge = newBridgeData.find(b => b._id === formData.bridge_id);
                if (bridge) {
                    selectedBridge.value = bridge;
                    console.log("Watch bridgeData: set selected bridge:", bridge);
                }
            }
        }, { immediate: true });

        // When cexAccountData changes and formData.cex_account_id is already set, reset selectedHedgeAccount
        watch(() => cexAccountData.value, (newAccountData) => {
            if (formData.cex_account_id && newAccountData.length > 0) {
                const account = newAccountData.find(a => a.id === formData.cex_account_id);
                if (account) {
                    selectedHedgeAccount.value = account;
                    console.log("Watch cexAccountData: set selected hedge account:", account);
                }
            }
        }, { immediate: true });

        // Mock balances
        const balances = reactive({
            cex: {
            },
            dex: {
            },
        });

        // Helper functions for display
        const getBridgeName = (id) => {
            const bridge = bridgeOptions.value.find(b => b.value === id);
            return bridge ? bridge.label : id;
        };

        const getCexAccountName = (id) => {
            // Ensure cexAccountOptions.value exists and is an array
            if (cexAccountOptions.value && Array.isArray(cexAccountOptions.value)) {
                const account = cexAccountOptions.value.find(a => a.value === id);
                return account ? account.label : id;
            }
            return id; // If cexAccountOptions.value does not exist or is not an array, return id
        };

        // Navigation functions
        const next = async () => {
            if (currentStep.value === 0) {
                // Create initial task with basic info
                if (!selectedBridge.value || !selectedHedgeAccount.value) {
                    message.warning('Please select both bridge and hedge account');
                    return;
                }
                const canNext = await createInitialTask();
                if (canNext) {
                    currentStep.value++;
                }
            }
            else if (currentStep.value === 1) {
                if (balanceConfirmationRef.value) {

                    await balanceConfirmationRef.value.confirmBalances();
                }
            }
            else if (currentStep.value === 2) {
                if (hedgeModeRef.value) {
                    await hedgeModeRef.value.confirm();
                }
            }
            else {
                currentStep.value++;
            }
        };

        const prev = () => {
            currentStep.value--;
        };

        // Validation for each step
        const isStepValid = (step) => {
            if (step === 0) {
                return formData.name && formData.bridge_id && formData.cex_account_id &&
                    formData.amm_name;
            }
            return true;
        };

        // API calls
        const createInitialTask = async () => {

            try {
                // Prepare parameters for creating hedge task
                const taskParams: { id?: string, name: string, account_id: string, bridge_id: string, amm_name: string } = {

                    name: formData.name,
                    account_id: formData.cex_account_id,
                    bridge_id: formData.bridge_id,
                    amm_name: formData.amm_name
                };
                if (createdHedgeId.value != '') {
                    taskParams.id = createdHedgeId.value.toString()
                }

                // Call API to create hedge task
                const hedgeTask = await createHedgeTask(taskParams);

                if (hedgeTask.id) {
                    createdHedgeId.value = hedgeTask.id;
                    // If creation is successful, save the task ID
                    taskId.value = hedgeTask.id;
                    message.success(`Initial task created successfully id:[${hedgeTask.id}]`);
                    return true
                } else {
                    // If error code is returned, display error message
                    message.error(`Failed to create task`);
                    return false
                }
            } catch (error) {
                message.error('Failed to create initial task');
                console.error('Error creating hedge task:', error);
                return false
            }
        };

        const refreshBalances = async () => {
            try {
                // message.info('Refreshing balances...');

                // message.success('Balances refreshed');
            } catch (error) {
                message.error('Failed to refresh balances');
                console.error(error);
            }
        };

        const submitForm = async () => {
            try {
                message.loading('Submitting hedge task...');
                const submitData: any = {
                    id: taskId.value,
                    hedgeTaskId: JSON.parse(JSON.stringify(createdHedgeId.value)),
                    initialBalances: JSON.parse(JSON.stringify(initialBalances.value)),
                    ...formData
                }
                console.log('Submitting complete task:',);
                console.log(submitData)
                console.log(JSON.stringify(submitData))
                // submitData.risk_config.
                saveHedgeData(submitData)
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                message.success('Hedge task created successfully');
                router.push('/hedge/tasks');
            } catch (error) {
                message.error('Failed to submit hedge task');
                console.error(error);
            }
        };

        return {
            currentStep,
            formData,
            balances,
            bridgeOptions,
            cexAccountOptions,
            ammOptions,
            loading,
            selectedHedgeAccount,
            selectedBridge,
            tokenData,
            next,
            prev,
            isStepValid,
            refreshBalances,
            handleBalancesConfirmed,
            handleHedgeModeConfirmed,
            submitForm,
            getBridgeName,
            getCexAccountName,
            bridgeTokens,
            balanceConfirmationRef,
            hedgeModeRef,
            isEditMode
        };
    },
});
</script>

<style scoped>
.hedge-task-container {
    background-color: #f5f7fa;
    padding: 24px;
    border-radius: 4px;
}

.step-content-container {
    background-color: #fff;
    padding: 24px;
    border-radius: 4px;
    margin-bottom: 24px;
    min-height: 300px;
}

.step-actions {
    display: flex;
    justify-content: flex-start;
}

.mb-6 {
    margin-bottom: 24px;
}

.mr-2 {
    margin-right: 8px;
}
</style>