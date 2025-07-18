<template>
    <div>
      <h3 class="step-title">Step 4: Review & Submit</h3>
      
      <div class="review-container">
        <div class="review-section">
          <h4>Basic Configuration</h4>
          <div class="review-item">
            <span class="review-label">Task Name:</span>
            <span class="review-value">{{ formData.name }}</span>
          </div>
          <div class="review-item">
            <span class="review-label">Bridge:</span>
            <span class="review-value">{{ getBridgeName(formData.bridge_id) }}</span>
          </div>
          <div class="review-item">
            <span class="review-label">CEX Account:</span>
            <span class="review-value">{{ getCexAccountName(formData.cex_account_id) }}</span>
          </div>
          <div class="review-item">
            <span class="review-label">AMM App:</span>
            <span class="review-value">{{ formData.amm_name }}</span>
          </div>
          <div class="review-item">
            <span class="review-label">Trading Pair:</span>
            <span class="review-value">{{ formData.pair }}</span>
          </div>
        </div>
        
        <div class="review-section">
          <h5>Maximum Asset Exposure</h5>
          <div v-for="(value, asset) in formData.risk_config.max_asset_exposure" :key="`max-${asset}`" class="review-item">
            <span class="review-label">{{ asset }} Max Exposure:</span>
            <span class="review-value">{{ value }} {{ asset }}</span>
          </div>
          
          <h5>Minimum Hedge Amount</h5>
          <div v-for="(value, asset) in formData.risk_config.min_hedge_amount" :key="`min-${asset}`" class="review-item">
            <span class="review-label">{{ asset }} Min Hedge:</span>
            <span class="review-value">{{ value }} {{ asset }}</span>
          </div>
        </div>
        
        <div class="review-notice">
          <a-alert
            message="Please review all information carefully before submitting."
            description="Once submitted, the hedge task will be created and start monitoring according to your configuration."
            type="info"
            show-icon
          />
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { Alert } from 'ant-design-vue';
  
  export default defineComponent({
    name: 'ReviewSubmitStep',
    components: {
      AAlert: Alert
    },
    props: {
      formData: {
        type: Object,
        required: true
      },
      getBridgeName: {
        type: Function,
        required: true
      },
      getCexAccountName: {
        type: Function,
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
  
  .review-container {
    width: 100%;
  }
  
  .review-section {
    margin-bottom: 24px;
  }
  
  .review-section h4 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .review-section h5 {
    font-size: 14px;
    font-weight: 500;
    margin-top: 16px;
    margin-bottom: 8px;
  }
  
  .review-item {
    display: flex;
    margin-bottom: 8px;
  }
  
  .review-label {
    width: 180px;
    color: rgba(0, 0, 0, 0.65);
  }
  
  .review-value {
    font-weight: 500;
  }
  
  .review-notice {
    margin-top: 32px;
  }
  </style>
  