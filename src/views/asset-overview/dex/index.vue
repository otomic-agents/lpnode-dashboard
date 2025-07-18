<template>
  <PageWrapper title="DEX Assets" contentBackground contentClass="p-4">
    <div class="dex-assets-container">
      <div class="asset-overview">
        <a-card class="mb-4">
          <div class="overview-header">
            <div class="overview-title">
              <h1>My Assets</h1>
              <div class="address-info">
                <span>Monitoring: {{ totalAddresses }} addresses</span>
              </div>
            </div>
            <div class="overview-actions">
              <a-button type="primary" size="small" @click="refreshAssets">
                <ReloadOutlined /> Refresh
              </a-button>
              <span class="update-time">(Last updated: {{ formatLastUpdated }})</span>
            </div>
          </div>
        </a-card>
      </div>

      <div class="chain-assets">
        <h3 class="section-title">Chain Asset Details</h3>

        <template v-if="chainAssets && chainAssets.length">
          <a-card v-for="chain in chainAssets" :key="chain.chainId" class="mb-4 chain-card">
            <div class="chain-header">
              <div class="chain-info">
                <ChainLogo :symbol="chain.chainName" size="small" :isChain="true" />
                <span class="chain-name">{{ chain.chainName }}</span>
              </div>
              <div class="chain-value">
                Chain Total Value: ${{ chain.totalValue || '0.00' }} USD
              </div>
            </div>

            <a-divider style="margin: 12px 0" />

            <div v-if="chain.addressAssets && chain.addressAssets.length">
              <div v-for="(address, index) in chain.addressAssets" :key="index" class="address-assets">
                <div class="address-header">
                  <div class="address-name">
                    {{ address.walletNames?.join(', ') || 'Unnamed Wallet' }} ({{ address.walletAddress }})
                    <a-button type="link" size="small" @click="copyAddress(address.walletAddress)">
                      [Copy]
                    </a-button>
                  </div>
                </div>

                <div class="token-list">
                  <div v-for="(token, tokenIndex) in address.tokens" :key="tokenIndex" class="token-item">
                    <div class="token-info">
                      <span class="token-symbol">
                        <ChainLogo :symbol="token.symbol" size="small" class="token-logo-small" :isChain="false" />
                        {{ token.symbol }}
                        <span v-if="token.isNative">({{ chain.nativeToken }})</span>
                      </span>
                    </div>
                    <div class="token-balance">
                      <div class="balance-row balance-amount">
                        <span class="balance-label">Amount:</span>
                        <span class="balance-value-text">{{ token.formattedBalance }}</span>
                      </div>
                      <div class="balance-row balance-value">
                        <span class="balance-label">Value:</span>
                        <span class="balance-value-text">${{ token.value || '0.00' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-assets">
              (No assets found for monitored addresses on this chain)
            </div>
          </a-card>
        </template>

        <a-empty v-else description="No DEX assets data available" />
      </div>

      <div class="asset-filters">
        <a-card>
          <a-checkbox v-model:checked="hideZeroBalance" @change="handleFilterChange">Hide Zero Balance Assets</a-checkbox>
          <br />
          <a-checkbox v-model:checked="hideSmallBalance" @change="handleFilterChange">Hide Small Balance Assets (&lt; $1)</a-checkbox>
        </a-card>
      </div>
    </div>
  </PageWrapper>
</template>



<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { PageWrapper } from '/@/components/Page';
import { Card, Empty, Divider, Button, Select, Checkbox } from 'ant-design-vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { getWalletAssets, WalletAssetsResponse, ChainAsset } from '/@/api/lpnode/DexAccount';
import { getExchangeRates } from '/@/api/lpnode/ExchangeRates'; // Import exchange rate API
import { message } from 'ant-design-vue';
import ChainLogo from '/@/views/chain-logo/index.vue';

export default defineComponent({
  name: 'DexAssetsPage',
  components: {
    PageWrapper,
    'a-card': Card,
    'a-empty': Empty,
    'a-divider': Divider,
    'a-button': Button,
    'a-select': Select,
    'a-select-option': Select.Option,
    'a-checkbox': Checkbox,
    ReloadOutlined,
    ChainLogo,
  },
  setup() {
    const totalAddresses = ref(0);
    const lastUpdated = ref('');
    const totalValue = ref('0');
    const chainAssets = ref<ChainAsset[]>([]);
    const currency = ref('USD');
    const hideZeroBalance = ref(false);
    const hideSmallBalance = ref(true);
    const loading = ref(false);
    const ratesMap = ref<Record<string, number>>({});

    const formatLastUpdated = computed(() => {
      if (!lastUpdated.value) return 'Unknown';

      const updateTime = new Date(lastUpdated.value);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;

      return updateTime.toLocaleDateString();
    });

    // Get token to USD exchange rate
    const getTokenUsdRate = (token: string): number => {
      // Normalize token symbol (remove possible parentheses content)
      const normalizedToken = token.split('(')[0].trim();

      // Special handling for stablecoins
      if (normalizedToken === 'USDT' || normalizedToken === 'USDC' ||
        normalizedToken === 'BUSD' || normalizedToken === 'DAI') {
        return 1; // All stablecoins calculated at 1:1
      }

      // Try to find token to USDT exchange rate
      const usdtRateKey = `${normalizedToken}/USDT`;
      if (ratesMap.value[usdtRateKey]) {
        console.log(`Found ${normalizedToken}/USDT rate:`, ratesMap.value[usdtRateKey]);
        return ratesMap.value[usdtRateKey];
      }

      // If rate not found, log warning and return 0
      console.warn(`Exchange rate for ${normalizedToken} not found`);
      return 0;
    };
    // Calculate token value
    const calculateTokenValue = (symbol: string, amount: number): number => {
      const rate = getTokenUsdRate(symbol);
      const value = amount * rate;
      console.log(`Calculating ${symbol} value: ${amount} * ${rate} = ${value}`);
      return value;
    };


    // Get exchange rate data
    const fetchRates = async () => {
      try {
        const response = await getExchangeRates();

        if (!response) {
          console.error('Failed to get exchange rates: Response is empty');
          return;
        }

        // Parse exchange rate data
        const rates: Record<string, number> = {};

        response.forEach(rate => {
          // Check required fields
          if (!rate.symbol || !rate.bids || rate.bids.length === 0) {
            return; // Skip invalid data
          }

          const bidPrice = parseFloat(rate.bids[0][0]);
          if (isNaN(bidPrice)) {
            return; // Skip invalid price
          }

          // Store exchange rate
          rates[rate.symbol] = bidPrice;
        });

        ratesMap.value = rates;
        console.log('Exchange rate data updated:', ratesMap.value);
      } catch (error) {
        console.error('Error fetching exchange rate data:', error);
      }
    };


    // Get asset data and calculate value
    const fetchAssets = async () => {
      try {
        loading.value = true;

        // First get latest exchange rates
        await fetchRates();

        const response = await getWalletAssets(hideZeroBalance.value, hideSmallBalance.value);

        if (response) {
          totalAddresses.value = response.totalAddresses;
          lastUpdated.value = response.lastUpdated;

          // Process asset data, calculate USD value
          let totalUsdValue = 0;

          // Process assets for each chain
          response.chainAssets.forEach(chain => {
            let chainTotalValue = 0;

            // Process assets for each address
            chain.addressAssets.forEach(address => {
              // Process each token
              address.tokens.forEach(token => {
                // Use formattedBalance or balance, ensure getting numeric value
                let balance = 0;
                if (token.formattedBalance) {
                  balance = parseFloat(token.formattedBalance);
                } else if (token.balance) {
                  balance = parseFloat(token.balance);
                }

                if (!isNaN(balance) && balance > 0) {
                  // Calculate token USD value
                  const usdValue = calculateTokenValue(token.symbol, balance);
                  token.value = usdValue.toFixed(2);
                  chainTotalValue += usdValue;
                  console.log(`${token.symbol} value: $${token.value} USD`);
                } else {
                  token.value = '0.00';
                }
              });
            });

            chain.totalValue = chainTotalValue.toFixed(2);
            totalUsdValue += chainTotalValue;
            console.log(`${chain.chainName} total value: $${chain.totalValue} USD`);
          });

          totalValue.value = totalUsdValue.toFixed(2);
          console.log(`Total asset value: $${totalValue.value} USD`);
          chainAssets.value = response.chainAssets;
        } else {
          message.error('Failed to get asset data');
        }
      } catch (error) {
        console.error('Error fetching asset data:', error);
        message.error('Error fetching asset data');
      } finally {
        loading.value = false;
      }
    };

    const refreshAssets = () => {
      message.loading({ content: 'Refreshing asset data...', key: 'refreshAssets' });
      fetchAssets().then(() => {
        message.success({ content: 'Asset data updated', key: 'refreshAssets' });
      });
    };

    const handleFilterChange = () => {
      fetchAssets();
    };

    const copyAddress = (address: string) => {
      navigator.clipboard.writeText(address)
        .then(() => {
          message.success('Address copied to clipboard');
        })
        .catch(() => {
          message.error('Failed to copy address');
        });
    };

    onMounted(() => {
      fetchAssets();
    });

    return {
      totalAddresses,
      lastUpdated,
      totalValue,
      chainAssets,
      currency,
      hideZeroBalance,
      hideSmallBalance,
      loading,
      formatLastUpdated,
      refreshAssets,
      handleFilterChange,
      copyAddress,
    };
  },
});
</script>



<style lang="less" scoped>
:deep(.token-logo), :deep(.chain-logo) {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  max-width: 24px !important;
  max-height: 24px !important;
}

:deep(.token-logo-small) {
  width: 20px !important;
  height: 20px !important;
  min-width: 20px !important;
  min-height: 20px !important;
  max-width: 20px !important;
  max-height: 20px !important;
}

.dex-assets-container {
  width: 100%;
}

.asset-overview {
  margin-bottom: 20px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.overview-title {
  h1 {
    margin-bottom: 8px;
  }
}

.address-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.overview-actions {
  text-align: right;
}

.update-time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 8px;
}

.section-title {
  margin-bottom: 16px;
}

.chain-card {
  margin-bottom: 16px;
}

.chain-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chain-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chain-name {
  font-size: 16px;
  font-weight: bold;
}

.chain-value {
  font-weight: bold;
}

.address-assets {
  margin-bottom: 16px;
}

.address-header {
  margin-bottom: 12px;
}

.address-name {
  font-weight: bold;
  word-break: break-all;
}

.token-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding-left: 16px;
}

.token-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.token-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.token-symbol {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}

.token-balance {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.balance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.balance-label {
  color: rgba(0, 0, 0, 0.65);
}

.balance-value-text {
  text-align: right;
  font-weight: 500;
}

.balance-amount {
  margin-bottom: 4px;
}

.balance-value {
  color: #1890ff;
}

.no-assets {
  font-style: italic;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  padding: 16px;
}

.asset-filters {
  margin-top: 20px;
}
</style>
