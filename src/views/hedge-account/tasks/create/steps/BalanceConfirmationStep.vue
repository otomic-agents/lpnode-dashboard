<template>
	<div>
		<h3 class="step-title">Step 2: Balance Confirmation</h3>

		<div class="balance-container">
			<div class="balance-header">
				<h4>Current Balances</h4>
				<a-button type="primary" @click="$emit('refresh')" size="small">
					<template #icon>
						<ReloadOutlined />
					</template>
					Refresh Balances
				</a-button>
			</div>

			<div class="bridge-info">
				<div class="info-item">
					<span class="label">Bridge:</span>
					<span class="value">{{ selectedBridge?.bridgeName || 'N/A' }}</span>
				</div>
				<div class="info-item">
					<span class="label">CEX Account:</span>
					<span class="value">{{ selectedHedgeAccount?.name || 'N/A' }} ({{ selectedHedgeAccount?.exchange ||
						'N/A' }})</span>
				</div>
				<div class="info-item" v-if="srcWalletInfo">
					<span class="label">Source Wallet:</span>
					<span class="value">{{ srcWalletInfo.walletName }} ({{ formatAddress(srcWalletInfo.address)
						}})</span>
				</div>
				<div class="info-item" v-if="dstWalletInfo">
					<span class="label">Destination Wallet:</span>
					<span class="value">{{ dstWalletInfo.walletName }} ({{ formatAddress(dstWalletInfo.address)
						}})</span>
				</div>
			</div>

			<div class="chain-balances">
				<!-- Source Chain Balances -->
				<div class="chain-section">
					<h4 class="chain-title">Source Chain: {{ getChainName(selectedBridge?.srcChainRawId) }}</h4>
					<div class="token-info">Token: {{ getSourceTokenName() }}</div>

					<div class="balance-cards">
						<div class="balance-card">
							<h5>CEX Balance</h5>
							<div class="balance-value" :class="{ 'loading': !balances.cex }">
								{{ !balances.cex ? 'Loading...' : getSourceCexBalanceValue() }}
							</div>
						</div>

						<div class="balance-card">
							<h5>DEX Balance</h5>
							<div class="balance-value" :class="{ 'loading': !balances.dex || !srcWalletInfo }">
								{{ !balances.dex || !srcWalletInfo ? 'Loading...' : getSourceDexBalanceValue() }}
							</div>
						</div>

						<div class="balance-card total">
							<h5>Total Balance</h5>
							<div class="balance-value"
								:class="{ 'loading': !balances.cex || !balances.dex || !srcWalletInfo }">
								{{ (!balances.cex || !balances.dex || !srcWalletInfo) ? 'Loading...' :
								getSourceTotalBalanceValue()
								}}
							</div>
						</div>
					</div>
				</div>

				<!-- Destination Chain Balances -->
				<div class="chain-section">
					<h4 class="chain-title">Destination Chain: {{ getChainName(selectedBridge?.dstChainRawId) }}</h4>
					<div class="token-info">Token: {{ getDestTokenName() }}</div>

					<div class="balance-cards">
						<div class="balance-card">
							<h5>CEX Balance</h5>
							<div class="balance-value" :class="{ 'loading': !balances.cex }">
								{{ !balances.cex ? 'Loading...' : getDestCexBalanceValue() }}
							</div>
						</div>

						<div class="balance-card">
							<h5>DEX Balance</h5>
							<div class="balance-value" :class="{ 'loading': !balances.dex || !dstWalletInfo }">
								{{ !balances.dex || !dstWalletInfo ? 'Loading...' : getDestDexBalanceValue() }}
							</div>
						</div>

						<div class="balance-card total">
							<h5>Total Balance</h5>
							<div class="balance-value"
								:class="{ 'loading': !balances.cex || !balances.dex || !dstWalletInfo }">
								{{ (!balances.cex || !balances.dex || !dstWalletInfo) ? 'Loading...' :
								getDestTotalBalanceValue() }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="note-section">
				<a-alert type="info" show-icon>
					<template #message>Important Note</template>
					<template #description>
						<p>Please verify that all balances are correct. When you click "Next", these balances will be
							used as the initial values for hedge task exposure monitoring.</p>
					</template>
				</a-alert>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue';
import { Button, Alert } from 'ant-design-vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { getWalletInfo, getTokenBalance } from '/@/api/lpnode/DexAccount';
import { getCexBalance } from '/@/api/lpnode/CexAccount';
interface BridgeInfo {
	_id: string;
	bridgeName: string;
	srcChainId: string;
	dstChainId: string;
	srcTokenId: string;
	dstTokenId: string;
	srcToken: string;
	dstToken: string;
	walletId: string;
	srcWalletId: string;
	receiveAddress: string;
	ammName: string;
	srcChainRawId: number | string;
	dstChainRawId: number | string;
}

interface WalletInfo {
	_id: string;
	walletName: string;
	address: string;
	addressLower: string;
	chainType: string;
	chainId: number;
	// Other fields...
}

interface HedgeAccountInfo {
	id: string;
	name: string;
	exchange: string;
}

const chainIdToName: Record<string | number, string> = {
	9006: 'BSC',
	501: 'Solana',
	614: 'Optimism',
	60: 'Ethereum',
};

export default defineComponent({
	name: 'BalanceConfirmationStep',
	components: {
		AButton: Button,
		AAlert: Alert,
		ReloadOutlined
	},
	props: {
		selectedBridge: {
			type: Object as PropType<BridgeInfo>,
			required: true
		},
		selectedHedgeAccount: {
			type: Object as PropType<HedgeAccountInfo>,
			required: true,
		},
		balances: {
			type: Object,
			required: true
		},
		tokensList: {
			type: Array as PropType<{
				chainId: number,
				address: string,
				tokenName: string,
				marketName: string,
				precision: number,
				coinType: string,
			}[]>,
			required: true,
		}
	},
	emits: ['refresh', 'confirm-balances'],
	setup(props, { emit,expose  }) {
		const srcWalletInfo = ref<WalletInfo | null>(null);
		const dstWalletInfo = ref<WalletInfo | null>(null);
		const isConfirming = ref(false);

		// Load wallet information
		const loadWalletInfo = async () => {
			try {
				if (props.selectedBridge.srcWalletId) {
					srcWalletInfo.value = await getWalletInfo(props.selectedBridge.srcWalletId);
				}

				if (props.selectedBridge.walletId) {
					dstWalletInfo.value = await getWalletInfo(props.selectedBridge.walletId);
				}
				console.log("Source Wallet:", srcWalletInfo.value);
				console.log("Destination Wallet:", dstWalletInfo.value);
				loadCexBalances();
				loadDexBalances()
			} catch (error) {
				console.error("Error loading wallet info:", error);
			}
		};
		const loadCexBalances = async () => {
			if (!props.selectedHedgeAccount) {
				console.error('Selected hedge account is missing');
				return;
			}

			try {
				// Get source chain token information
				const srcTokenName = getSourceTokenName();
				// Get destination chain token information
				const dstTokenName = getDestTokenName();

				// If balances.cex doesn't exist, initialize it
				if (!props.balances.cex) {
					props.balances.cex = {};
				}

				// Get source token CEX balance
				const srcCexBalance = await getCexBalance(
					props.selectedHedgeAccount.id,
					srcTokenName
				);

				if (srcCexBalance) {
					// Check if free value is valid
					if (srcCexBalance.free === undefined || srcCexBalance.free === null) {
						props.balances.cex[srcTokenName] = '0';
					} else {
						props.balances.cex[srcTokenName] = srcCexBalance.free;
					}
				} else {
					props.balances.cex[srcTokenName] = '0';
				}

				// Get destination token CEX balance
				const dstCexBalance = await getCexBalance(
					props.selectedHedgeAccount.id,
					dstTokenName
				);

				if (dstCexBalance) {
					// Check if free value is valid
					if (dstCexBalance.free === undefined || dstCexBalance.free === null) {
						props.balances.cex[dstTokenName] = '0';
					} else {
						props.balances.cex[dstTokenName] = dstCexBalance.free;
					}
				} else {
					props.balances.cex[dstTokenName] = '0';
				}

			} catch (error) {
				console.error("Error loading CEX balances:", error);
			}
		};


		const loadDexBalances = async () => {
			if (!srcWalletInfo.value || !dstWalletInfo.value) return;

			try {
				// Get source chain token information
				const srcTokenName = getSourceTokenName();
				const srcTokenAddress = props.selectedBridge.srcToken;
				const srcChainId = props.selectedBridge.srcChainRawId;

				// Get destination chain token information
				const dstTokenName = getDestTokenName();
				const dstTokenAddress = props.selectedBridge.dstToken;
				const dstChainId = props.selectedBridge.dstChainRawId;

				// If balances.dex doesn't exist, initialize it
				if (!props.balances.dex) {
					props.balances.dex = {};
				}

				// Get source wallet token balance
				const srcWalletAddress = srcWalletInfo.value.address;
				if (!props.balances.dex[srcWalletAddress]) {
					props.balances.dex[srcWalletAddress] = {};
				}

				const srcTokenBalance = await getTokenBalance(
					srcWalletAddress,
					srcTokenAddress,
					Number(srcChainId)
				);
				console.log(srcTokenBalance)
				if (srcTokenBalance) {
					props.balances.dex[srcWalletAddress][srcTokenName] = srcTokenBalance.balance;
					console.log(`Source wallet ${srcTokenName} ${srcTokenAddress} balance: ${srcTokenBalance.balance}`);
				} else {
					props.balances.dex[srcWalletAddress][srcTokenName] = '0';
					console.log(`Source wallet ${srcWalletAddress} ${srcTokenName} ${srcTokenAddress} balance not found, setting to 0`);
				}

				// Get destination wallet token balance
				const dstWalletAddress = dstWalletInfo.value.address;
				if (!props.balances.dex[dstWalletAddress]) {
					props.balances.dex[dstWalletAddress] = {};
				}

				const dstTokenBalance = await getTokenBalance(
					dstWalletAddress,
					dstTokenAddress,
					Number(dstChainId)
				);

				if (dstTokenBalance) {
					props.balances.dex[dstWalletAddress][dstTokenName] = dstTokenBalance.balance;
					console.log(`Destination wallet ${dstTokenName} balance: ${dstTokenBalance.balance}`);
				} else {
					props.balances.dex[dstWalletAddress][dstTokenName] = '0';
					console.log(`Destination wallet ${dstTokenName} balance not found, setting to 0`);
				}

			} catch (error) {
				console.error("Error loading DEX balances:", error);
			}
		};
		// Format address display
		const formatAddress = (address: string) => {
			if (!address) return '';
			return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
		};

		// Get chain name
		const getChainName = (chainId: string | number | undefined) => {
			if (!chainId) return 'Unknown';
			return chainIdToName[chainId] || `Chain-${chainId}`;
		};

		// Get token name
		const getSourceTokenName = () => {
			if (!props.selectedBridge) return 'Unknown';

			if (props.tokensList && props.tokensList.length > 0) {
				const token = props.tokensList.find((t: any) => t._id === props.selectedBridge.srcTokenId);
				if (token) return token.tokenName;
			}

			const address = props.selectedBridge.srcToken;
			return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Unknown';
		};

		const getDestTokenName = () => {
			if (!props.selectedBridge) return 'Unknown';

			if (props.tokensList && props.tokensList.length > 0) {
				const token = props.tokensList.find((t: any) => t._id === props.selectedBridge.dstTokenId);
				if (token) return token.tokenName;
			}

			const address = props.selectedBridge.dstToken;
			return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Unknown';
		};

		// Get balance
		const getSourceCexBalance = () => {
			const tokenName = getSourceTokenName();
			console.log(tokenName, "@@@@@@@@@@@@@@@@@@@@@@@@@@")

			return props.balances.cex?.[tokenName] || 0; // Add return value
		};

		const getSourceDexBalance = () => {
			if (!srcWalletInfo.value) return 0;

			// Use wallet address to find DEX balance
			const tokenName = getSourceTokenName();
			const walletAddress = srcWalletInfo.value.address;

			// If there is data indexed by wallet address in balances.dex, use it
			if (props.balances.dex?.[walletAddress]?.[tokenName]) {
				return props.balances.dex[walletAddress][tokenName];
			}

			// Otherwise try to use token name directly
			return props.balances.dex?.[tokenName] || 0;
		};

		const getDestCexBalance = () => {
			const tokenName = getDestTokenName();
			return props.balances.cex?.[tokenName] || 0;
		};

		const getDestDexBalance = () => {
			if (!dstWalletInfo.value) return 0;

			// Use wallet address to find DEX balance
			const tokenName = getDestTokenName();
			const walletAddress = dstWalletInfo.value.address;

			// If there is data indexed by wallet address in balances.dex, use it
			if (props.balances.dex?.[walletAddress]?.[tokenName]) {
				return props.balances.dex[walletAddress][tokenName];
			}

			// Otherwise try to use token name directly
			return props.balances.dex?.[tokenName] || 0;
		};

		// Format balance display
		const getSourceCexBalanceValue = () => {
			const tokenName = getSourceTokenName();
			const balance = getSourceCexBalance();
			return `${Number(balance).toFixed(6)} ${tokenName}`;
		};

		const getSourceDexBalanceValue = () => {
			const tokenName = getSourceTokenName();
			const balance = getSourceDexBalance();
			return `${Number(balance).toFixed(6)} ${tokenName}`;
		};

		const getDestCexBalanceValue = () => {
			const tokenName = getDestTokenName();
			const balance = getDestCexBalance();
			return `${Number(balance).toFixed(6)} ${tokenName}`;
		};

		const getDestDexBalanceValue = () => {
			const tokenName = getDestTokenName();
			const balance = getDestDexBalance();
			return `${Number(balance).toFixed(6)} ${tokenName}`;
		};

		// Calculate total balance
		const getSourceTotalBalanceValue = () => {
			const tokenName = getSourceTokenName();
			const cexBalance = getSourceCexBalance();
			const dexBalance = getSourceDexBalance();
			const totalBalance = Number(cexBalance) + Number(dexBalance);
			return `${totalBalance.toFixed(6)} ${tokenName}`;
		};

		const getDestTotalBalanceValue = () => {
			const tokenName = getDestTokenName();
			const cexBalance = getDestCexBalance();
			const dexBalance = getDestDexBalance();
			const totalBalance = Number(cexBalance) + Number(dexBalance);
			return `${totalBalance.toFixed(6)} ${tokenName}`;
		};

		// Confirm balances and proceed to next step
		const confirmBalances = async () => {
			if (!props.balances.cex || !props.balances.dex || !srcWalletInfo.value || !dstWalletInfo.value) {
				return;
			}

			isConfirming.value = true;

			try {
				// Prepare initial balance data
				const initialBalances = {
					source: {
						token: getSourceTokenName(),
						cex: getSourceCexBalance(),
						dex: getSourceDexBalance(),
						total: Number(getSourceCexBalance()) + Number(getSourceDexBalance()),
						wallet: srcWalletInfo.value.address,
						walletName: srcWalletInfo.value.walletName
					},
					destination: {
						token: getDestTokenName(),
						cex: getDestCexBalance(),
						dex: getDestDexBalance(),
						total: Number(getDestCexBalance()) + Number(getDestDexBalance()),
						wallet: dstWalletInfo.value.address,
						walletName: dstWalletInfo.value.walletName
					}
				};

				// Send confirmation event, passing current balances as initial values to parent component
				emit('confirm-balances', initialBalances);
			} catch (error) {
				console.error('Error confirming balances:', error);
			} finally {
				isConfirming.value = false;
			}
		};
		expose({
			confirmBalances
		});
		onMounted(() => {
			loadWalletInfo();
		});

		return {
			srcWalletInfo,
			dstWalletInfo,
			getChainName,
			getSourceTokenName,
			getDestTokenName,
			getSourceCexBalanceValue,
			getSourceDexBalanceValue,
			getDestCexBalanceValue,
			getDestDexBalanceValue,
			getSourceTotalBalanceValue,
			getDestTotalBalanceValue,
			confirmBalances,
			isConfirming,
			formatAddress
		};
	}
});
</script>


<style scoped>
.step-title {
	margin-bottom: 20px;
	font-size: 18px;
	font-weight: 500;
}

.balance-container {
	width: 100%;
}

.balance-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.balance-header h4 {
	margin: 0;
	font-size: 16px;
}

.bridge-info {
    background-color: #f5f7fa;
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 20px;
    width: 100%; 
    box-sizing: border-box; 
}

.info-item {
    display: flex;
    margin-bottom: 8px;
    flex-wrap: wrap; 
}

.info-item:last-child {
	margin-bottom: 0;
}

.label {
    font-weight: 500;
    min-width: 150px; 
    width: auto; 
    margin-right: 10px;
}
.value {
    flex: 1; 
    word-break: break-word;
}

.chain-balances {
	display: flex;
	flex-direction: column;
	gap: 24px;
	margin-bottom: 24px;
}

.chain-section {
	border: 1px solid #e8e8e8;
	border-radius: 4px;
	padding: 16px;
}

.chain-title {
	margin: 0 0 8px 0;
	font-size: 16px;
	font-weight: 500;
}

.token-info {
	margin-bottom: 16px;
	color: #666;
}

.balance-cards {
	display: flex;
	gap: 16px;
}

.balance-card {
	flex: 1;
	background-color: #f9f9f9;
	border-radius: 4px;
	padding: 16px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.balance-card.total {
	background-color: #f0f7ff;
	border-left: 3px solid #1890ff;
}

.balance-card h5 {
	margin: 0 0 12px 0;
	font-size: 14px;
	font-weight: 500;
	color: #666;
}

.balance-card.total h5 {
	color: #1890ff;
}

.balance-value {
	font-size: 18px;
	font-weight: 500;
	color: #333;
}

.balance-card.total .balance-value {
	color: #1890ff;
	font-weight: 600;
}

.balance-value.loading {
	color: #999;
	font-style: italic;
}

.note-section {
	margin-bottom: 24px;
}

.action-buttons {
	display: flex;
	justify-content: center;
	margin-top: 32px;
}

.action-buttons button {
	min-width: 200px;
	height: 40px;
	font-size: 16px;
}

@media (max-width: 768px) {
	.balance-cards {
		flex-direction: column;
		gap: 16px;
	}

	.action-buttons button {
		width: 100%;
	}
}
</style>