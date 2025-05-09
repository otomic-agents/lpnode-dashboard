<template>
  <PageWrapper title="CEX Assets" contentBackground contentClass="p-4">
    <div class="cex-assets-container">
      <div class="asset-overview">
        <a-card class="mb-4">
          <div class="overview-header">
            <div class="overview-title">
              <h1>CEX Assets</h1>
              <div class="account-info">
                <span>Monitoring: {{ totalAccounts }} accounts</span>
                <span class="total-value">Total Value: ${{ formatNumber(totalUsdValue) }}</span>
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

      <div class="account-assets">
        <h3 class="section-title">CEX Account Details</h3>

        <template v-if="cexAccounts && cexAccounts.length">
          <a-card v-for="account in cexAccounts" :key="account.id" class="mb-4 account-card">
            <div class="account-header">
              <div class="account-info">
                <ExchangeLogo :exchange="account.exchange" size="medium" />
                <span class="account-name">{{ account.name }}</span>
                <span class="exchange-name">({{ account.exchange }})</span>
              </div>
              <div class="account-value">
                <span>Total Value: ${{ formatNumber(getAccountTotalValue(account)) }}</span>
              </div>
            </div>

            <a-divider style="margin: 12px 0" />

            <div v-if="account.tokens && account.tokens.length">
              <div class="token-list">
                <div v-for="(token, tokenIndex) in account.tokens" :key="tokenIndex" class="token-item">
                  <div class="token-info">
                    <span class="token-symbol">
                      <TokenLogo :symbol="token.asset" size="small" />
                      {{ token.asset }}
                    </span>
                  </div>
                  <div class="token-balance">
                    <div class="balance-amount">Available: {{ token.free }} {{ token.asset }}</div>
                    <div class="balance-locked" v-if="parseFloat(token.locked) > 0">
                      Locked: {{ token.locked }} {{ token.asset }}
                    </div>
                    <div class="balance-usd" v-if="token.usdValue && parseFloat(token.usdValue) > 0">
                      Usd Value: ${{ formatNumber(token.usdValue) }}
                    </div>
                    <div class="balance-usd-unavailable" v-else>
                      Usd Value: Not available
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-assets">
              (No assets found for this CEX account)
            </div>
          </a-card>
        </template>

        <a-empty v-else description="No CEX assets data available" />
      </div>

      <div class="asset-filters">
        <a-card>
          <a-checkbox v-model:checked="hideZeroBalance" @change="handleFilterChange">Hide Zero Balance Assets</a-checkbox>
        </a-card>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { PageWrapper } from '/@/components/Page';
import { Card, Empty, Divider, Button, Checkbox } from 'ant-design-vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { listCexAccounts, getAllCexTokenBalances } from '/@/api/lpnode/CexAccount';
import { getAllMarketPrices } from '/@/api/lpnode/MarketPrice';
import { message } from 'ant-design-vue';
import TokenLogo from '/@/views/token-logo/index.vue';
import ExchangeLogo from '/@/views/exchange-logo/index.vue';

interface TokenBalance {
  asset: string;
  free: string;
  locked: string;
  total: string;
  usdValue: string;
}

interface TokenPrice {
  symbol: string;
  price: number;
}

interface CexAccount {
  id: string;
  name: string;
  exchange: string;
  api_key: string;
  status: string;
  tokens: TokenBalance[];
}

export default defineComponent({
  name: 'CexAssetsPage',
  components: {
    PageWrapper,
    'a-card': Card,
    'a-empty': Empty,
    'a-divider': Divider,
    'a-button': Button,
    'a-checkbox': Checkbox,
    ReloadOutlined,
    TokenLogo,
    ExchangeLogo,
  },
  setup() {
    const totalAccounts = ref(0);
    const lastUpdated = ref(new Date().toISOString());
    const cexAccounts = ref<CexAccount[]>([]);
    const hideZeroBalance = ref(false);
    const loading = ref(false);
    const marketPrices = ref<TokenPrice[]>([]);
    const totalUsdValue = ref(0);

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

    const formatNumber = (value: string | number) => {
      if (typeof value === 'string') {
        value = parseFloat(value);
      }
      
      if (isNaN(value)) return '0.00';
      
      // Format with commas and 2 decimal places
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const getTokenPrice = (symbol: string): number => {
      const token = marketPrices.value.find(
        (p) => p.symbol.toUpperCase() === symbol.toUpperCase()
      );
      return token ? token.price : 0;
    };

    const calculateTokenUsdValue = (token: TokenBalance): string => {
      const price = getTokenPrice(token.asset);
      const totalAmount = parseFloat(token.total || '0');
      
      // Only return a value if we have a valid price and amount
      if (price > 0 && !isNaN(totalAmount)) {
        return (price * totalAmount).toString();
      }
      
      // Return empty string instead of '0' when no price data is available
      return '';
    };

    const getAccountTotalValue = (account: CexAccount): number => {
      if (!account.tokens || !account.tokens.length) return 0;
      
      return account.tokens.reduce((sum, token) => {
        return sum + parseFloat(token.usdValue || '0');
      }, 0);
    };

    // Fetch market prices
    const fetchMarketPrices = async () => {
      try {
        const prices = await getAllMarketPrices();
        if (prices) {
          marketPrices.value = prices;
        }
      } catch (error) {
        console.error('Error fetching market prices:', error);
        message.error('Failed to fetch market prices');
      }
    };

    // Fetch all CEX accounts and their tokens
    const fetchAssets = async () => {
      try {
        loading.value = true;

        // First get market prices
        await fetchMarketPrices();

        // Get all CEX accounts
        const accountsResponse = await listCexAccounts();
        
        if (!accountsResponse) {
          message.error('Failed to get CEX accounts');
          return;
        }

        const accounts = accountsResponse;
        totalAccounts.value = accounts.length;
        
        // Process each account to get tokens
        const accountsWithTokens: CexAccount[] = [];
        let overallTotalValue = 0;

        for (const account of accounts) {
          try {
            const tokensResponse = await getAllCexTokenBalances(account.id);
            
            if (tokensResponse) {
              const tokens = tokensResponse.map(token => {
                // Calculate USD value for each token
                const usdValue = calculateTokenUsdValue(token);
                return {
                  ...token,
                  usdValue
                };
              });

              // Filter tokens based on settings
              const filteredTokens = tokens.filter(token => {
                const balance = parseFloat(token.free);
                
                if (hideZeroBalance.value && balance === 0) {
                  return false;
                }
                
                return true;
              });

              accountsWithTokens.push({
                ...account,
                tokens: filteredTokens
              });

              // Add to total USD value
              const accountValue = filteredTokens.reduce(
                (sum, token) => sum + parseFloat(token.usdValue || '0'), 
                0
              );
              overallTotalValue += accountValue;
            }
          } catch (error) {
            console.error(`Error fetching tokens for account ${account.id}:`, error);
          }
        }

        cexAccounts.value = accountsWithTokens;
        totalUsdValue.value = overallTotalValue;
        lastUpdated.value = new Date().toISOString();
        
      } catch (error) {
        console.error('Error fetching CEX assets:', error);
        message.error('Failed to fetch CEX assets');
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

    onMounted(() => {
      fetchAssets();
    });

    return {
      totalAccounts,
      lastUpdated,
      cexAccounts,
      hideZeroBalance,
      loading,
      formatLastUpdated,
      refreshAssets,
      handleFilterChange,
      formatNumber,
      getAccountTotalValue,
      totalUsdValue
    };
  },
});
</script>

<style lang="less" scoped>
.cex-assets-container {
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

.account-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.total-value {
  font-weight: bold;
  color: #52c41a;
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

.account-card {
  margin-bottom: 16px;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-name {
  font-size: 16px;
  font-weight: bold;
}

.exchange-name {
  color: rgba(0, 0, 0, 0.65);
}

.account-value {
  font-weight: bold;
  color: #52c41a;
}

.token-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.token-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.token-info {
  margin-bottom: 12px;
}

.token-symbol {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.token-balance {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.balance-amount {
  color: #52c41a;
}

.balance-locked {
  color: #faad14;
}

.balance-usd {
  color: #1890ff;
  font-weight: bold;
}

.balance-usd-unavailable {
  color: #d9d9d9;
  font-style: italic;
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