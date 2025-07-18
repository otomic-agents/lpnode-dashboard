<template>
    <div class="token-logo" :class="sizeClass">
      <img 
        :src="logoSrc" 
        :alt="symbol"
        @error="handleImageError"
      />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  
  export default defineComponent({
    name: 'TokenLogo',
    props: {
      symbol: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        default: 'medium',
        validator: (value: string) => ['small', 'medium', 'large'].includes(value),
      },
    },
    setup(props) {
      const hasError = ref(false);
      

      const logoSrc = computed(() => {
        const normalizedSymbol = props.symbol.toLowerCase().trim();
        
        if (hasError.value) {
          return `https://ui-avatars.com/api/?name=${normalizedSymbol}&background=${getColorForSymbol(normalizedSymbol)}&color=fff&size=128&bold=true&format=svg`;
        }
        
        return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/128/color/${normalizedSymbol}.png`;
      });
  
      const sizeClass = computed(() => `token-logo--${props.size}`);
  
      const handleImageError = () => {
        hasError.value = true;
      };
      
      const getColorForSymbol = (symbol: string): string => {
        let hash = 0;
        for (let i = 0; i < symbol.length; i++) {
          hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const c = (hash & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();
        
        return "00000".substring(0, 6 - c.length) + c;
      };
  
      return {
        logoSrc,
        sizeClass,
        handleImageError,
      };
    },
  });
  </script>
  
  <style lang="less" scoped>
  .token-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f0f2f5;
  
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
  