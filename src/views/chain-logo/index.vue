<!-- ChainLogo.vue -->
<template>
  <img :src="currentSource" :class="['chain-logo', size]" @error="handleImageError" :alt="symbol" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  symbol: string;
  size?: 'small' | 'medium' | 'large';
  isChain?: boolean; // New parameter to distinguish between chain and token
}>();

const sources = ref<string[]>([]);
const currentSourceIndex = ref(0);
const currentSource = ref('');

// Mapping from chain names to standard symbols
const symbolMap: Record<string, string> = {
  'BSC': 'bnb',
  'BNB': 'bnb',
  'ETH': 'eth',
  'ETHEREUM': 'eth',
  'SOL': 'sol',
  'SOLANA': 'sol',
  'POLYGON': 'matic',
  'MATIC': 'matic',
  'AVALANCHE': 'avax',
  'AVAX': 'avax',
  'FANTOM': 'ftm',
  'FTM': 'ftm',
  'ARBITRUM': 'arb',
  'ARB': 'arb',
  'OPTIMISM': 'op',
  'OP': 'op',
  'BITCOIN': 'btc',
  'BTC': 'btc',
  'USDT': 'usdt',
  'USDC': 'usdc',
  'DAI': 'dai',
};

// Chain-specific logo sources
const chainLogoSources: Record<string, string[]> = {
  'eth': [
    'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png'
  ],
  'bnb': [
    'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ],
  'sol': [
    'https://cryptologos.cc/logos/solana-sol-logo.png',
    'https://assets.coingecko.com/coins/images/4128/thumb/solana.png'
  ],
  'matic': [
    'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png'
  ],
  'avax': [
    'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    'https://assets.coingecko.com/coins/images/12559/thumb/Avalanche_Circle_RedWhite_Trans.png'
  ],
  'ftm': [
    'https://cryptologos.cc/logos/fantom-ftm-logo.png',
    'https://assets.coingecko.com/coins/images/4001/thumb/Fantom_round.png'
  ],
  'arb': [
    'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    'https://assets.coingecko.com/coins/images/16547/thumb/arbitrum.png'
  ],
  'op': [
    'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
    'https://assets.coingecko.com/coins/images/25244/thumb/Optimism.png'
  ],
  'btc': [
    'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png'
  ],
};

// Token-specific logo sources
const tokenLogoSources: Record<string, string[]> = {
  'usdt': [
    'https://cryptologos.cc/logos/tether-usdt-logo.png',
    'https://assets.coingecko.com/coins/images/325/thumb/Tether.png'
  ],
  'usdc': [
    'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png'
  ],
  'dai': [
    'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    'https://assets.coingecko.com/coins/images/9956/thumb/Badge_Dai.png'
  ],
  'weth': [
    'https://cryptologos.cc/logos/wrapped-ethereum-weth-logo.png',
    'https://assets.coingecko.com/coins/images/2518/thumb/weth.png'
  ],
  'wbnb': [
    'https://cryptologos.cc/logos/wrapped-bnb-wbnb-logo.png',
    'https://assets.coingecko.com/coins/images/12591/thumb/binance-coin-logo.png'
  ],
};

const loadImage = () => {
  if (!props.symbol) {
    currentSource.value = 'https://via.placeholder.com/24?text=?';
    return;
  }

  const symbolLower = props.symbol.toLowerCase();
  const mappedSymbol = symbolMap[props.symbol.toUpperCase()] || symbolLower;

  // Choose different icon sources based on whether it's a chain or token
  if (props.isChain && chainLogoSources[mappedSymbol]) {
    sources.value = [...chainLogoSources[mappedSymbol]];
  } else if (!props.isChain && tokenLogoSources[mappedSymbol]) {
    sources.value = [...tokenLogoSources[mappedSymbol]];
  } else {
    // Generic icon sources
    sources.value = [
      // Generic CoinGecko source
      `https://assets.coingecko.com/coins/images/search?query=${mappedSymbol}`,

      // Other generic sources
      `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${mappedSymbol}.svg`,
      `https://cryptoicons.org/api/icon/${mappedSymbol}/64`,

      // TrustWallet source
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${mappedSymbol}/info/logo.png`,
    ];
  }

  // Add generic fallback source
  sources.value.push(
    // Default placeholder
    'https://via.placeholder.com/24?text=' + props.symbol.substring(0, 1).toUpperCase()
  );

  // Filter out empty strings
  sources.value = sources.value.filter(src => src);

  currentSourceIndex.value = 0;
  currentSource.value = sources.value[0];
};

const handleImageError = () => {
  currentSourceIndex.value++;
  if (currentSourceIndex.value < sources.value.length) {
    currentSource.value = sources.value[currentSourceIndex.value];
  }
};

onMounted(() => {
  loadImage();
});

watch(() => props.symbol, () => {
  loadImage();
});
</script>

<style scoped>
.chain-logo {
  border-radius: 50%;
  object-fit: contain;
}

.small {
  width: 16px;
  height: 16px;
}

.medium {
  width: 24px;
  height: 24px;
}

.large {
  width: 32px;
  height: 32px;
}
</style>
