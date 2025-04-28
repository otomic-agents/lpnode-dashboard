<template>
    <div class="exchange-logo" :class="sizeClass">
      <img :src="logoSrc" :alt="exchange" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  // Import logos
  import binanceLogo from './logos/binance.svg';
  import okxLogo from './logos/okx.svg';
  import huobiLogo from './logos/huobi.svg';
  import coinbaseLogo from './logos/coinbase.svg';
  import defaultLogo from './logos/default.svg';
  
  export default defineComponent({
    name: 'ExchangeLogo',
    props: {
      exchange: {
        type: String,
        required: true,
        default: '',
      },
      size: {
        type: String,
        default: 'medium',
        validator: (value: string) => ['small', 'medium', 'large'].includes(value),
      },
    },
    setup(props) {
      // Map exchange names to logo files
      const logoMap: Record<string, string> = {
        binance: binanceLogo,
        okx: okxLogo,
        huobi: huobiLogo,
        coinbase: coinbaseLogo,
      };
  
      // Compute the logo source based on the exchange name
      const logoSrc = computed(() => {
        const normalizedExchange = props.exchange.toLowerCase().trim();
        return logoMap[normalizedExchange] || defaultLogo;
      });
  
      // Compute CSS class based on size prop
      const sizeClass = computed(() => `exchange-logo--${props.size}`);
  
      return {
        logoSrc,
        sizeClass,
      };
    },
  });
  </script>
  
  <style lang="less" scoped>
  .exchange-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f0f2f5;
    overflow: hidden;
  
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  
    &--small {
      width: 24px;
      height: 24px;
    }
  
    &--medium {
      width: 32px;
      height: 32px;
    }
  
    &--large {
      width: 48px;
      height: 48px;
    }
  }
  </style>