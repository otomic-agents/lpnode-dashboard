<!-- ChainLogo.vue -->
<template>
    <img 
      :src="currentSource" 
      :class="['chain-logo', size]" 
      @error="handleImageError" 
      :alt="symbol"
    />
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps<{
    symbol: string;
    size?: 'small' | 'medium' | 'large';
  }>();
  
  const sources = ref<string[]>([]);
  const currentSourceIndex = ref(0);
  const currentSource = ref('');
  
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
  
  const loadImage = () => {
    if (!props.symbol) {
      currentSource.value = 'https://via.placeholder.com/24?text=?';
      return;
    }
    
    const symbolLower = props.symbol.toLowerCase();
    const mappedSymbol = symbolMap[props.symbol.toUpperCase()] || symbolLower;
    
    sources.value = [
      `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${mappedSymbol}.svg`,
      `https://cryptoicons.org/api/icon/${mappedSymbol}/64`,
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${mappedSymbol}/info/logo.png`,
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x${mappedSymbol}/logo.png`,
      'https://via.placeholder.com/24?text=' + props.symbol.substring(0, 1).toUpperCase()
    ];
    
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
  