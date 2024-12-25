<template>
  <div class="step2">

    <a-row :gutter="24">
      <a-col :span="1" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onEthWBTC"> eth-WBTC </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onEthWETH"> eth-WETH </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onEthUSDC"> eth-USDC </a-button> 
      </a-col>
      <a-col :span="1" ></a-col>
    </a-row>
    
    <a-row :gutter="24">
      <a-col :span="1" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onBscWBTC"> bsc-WBTC </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onBscWETH"> bsc-WETH </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onBscUSDC"> bsc-USDC </a-button> 
      </a-col>
      <a-col :span="1" ></a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="1" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onOptWBTC"> opt-WBTC </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onOptWETH"> opt-WETH </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onOptUSDC"> opt-USDC </a-button>
      </a-col>
      <a-col :span="1" ></a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="1" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onSolanaWBTC"> solana-WBTC </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onSolanaWETH"> solana-WETH </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onSolanaUSDC"> solana-USDC </a-button>
      </a-col>
      <a-col :span="1" ></a-col>
    </a-row>

    <BasicForm @register="register" />

  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step2Schemas, step2SchemasNear } from './data';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';
  import { Progress, Row, Col } from 'ant-design-vue';


  export default defineComponent({
    components: {
      BasicForm,
      [Alert.name]: Alert,
      [Divider.name]: Divider,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    props: {
      ctx: { type: Object}
    },
    emits: ['next', 'prev'],
    setup(props, { emit }) {

      let showSchemas = step2Schemas
      if (props.ctx.chain == "near") {
        showSchemas = step2SchemasNear
      }

      console.log('props.ctx.defaultData', props.ctx)
      if (props.ctx.defaultData != undefined) {
        for (const schema of showSchemas) {
          schema.defaultValue = props.ctx.defaultData[schema.field]
        }
      }


      const [register, { validate, setProps, setFieldsValue }] = useForm({
        labelWidth: 80,
        schemas: showSchemas,
        actionColOptions: {
          span: 14,
        },
        showResetButton: false,
        submitButtonOptions: {
          text: 'next',
        },
        resetFunc: customResetFunc,
        submitFunc: customSubmitFunc,
      });

      async function customResetFunc() {
        emit('prev');
      }

      async function customSubmitFunc() {
        try {
          const values = await validate();
          setProps({
            submitButtonOptions: {
              loading: false,
            },
          });
          setTimeout(() => {
            setProps({
              submitButtonOptions: {
                loading: false,
              },
            });
            emit('next', values);
          }, 1);
        } catch (error) {}
      }

      const onEthWBTC = () => {
        setFieldsValue({
          address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
          token_name: 'WBTC',
          market_name: 'BTC',
          precision: 8,
          type: 'coin'
        })
      }

      const onEthWETH = () => {
        setFieldsValue({
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          token_name: 'WETH',
          market_name: 'ETH',
          precision: 18,
          type: 'coin'
        })
      }

      const onEthUSDC = () => {
        setFieldsValue({
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          token_name: 'USDC',
          market_name: 'USDT',
          precision: 18,
          type: 'stable_coin'
        })
      }

      const onBscWBTC = () => {
        setFieldsValue({
          address: '0x0555e30da8f98308edb960aa94c0db47230d2b9c',
          token_name: 'WBTC',
          market_name: 'BTC',
          precision: 8,
          type: 'coin'
        })
      }

      const onBscWETH = () => {
        setFieldsValue({
          address: '0x4db5a66e937a9f4473fa95b1caf1d1e1d62e29ea',
          token_name: 'WETH',
          market_name: 'ETH',
          precision: 18,
          type: 'coin'
        })
      }

      const onBscUSDC = () => {
        setFieldsValue({
          address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          token_name: 'USDC',
          market_name: 'USDT',
          precision: 18,
          type: 'stable_coin'
        })
      }

      const onOptWBTC = () => {
        setFieldsValue({
          address: '0x68f180fcce6836688e9084f035309e29bf0a2095',
          token_name: 'WBTC',
          market_name: 'BTC',
          precision: 8,
          type: 'coin'
        })
      }

      const onOptWETH = () => {
        setFieldsValue({
          address: '0x4200000000000000000000000000000000000006',
          token_name: 'WETH',
          market_name: 'ETH',
          precision: 18,
          type: 'coin'
        })
      }

      const onOptUSDC = () => {
        setFieldsValue({
          address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          token_name: 'USDC',
          market_name: 'USDT',
          precision: 18,
          type: 'stable_coin'
        })
      }

      const onSolanaWBTC = () => {
        setFieldsValue({
          address: '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh',
          token_name: 'WBTC',
          market_name: 'BTC',
          precision: 8,
          type: 'coin'
        })
      }

      const onSolanaWETH = () => {
        setFieldsValue({
          address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
          token_name: 'WETH',
          market_name: 'ETH',
          precision: 18,
          type: 'coin'
        })
      }

      const onSolanaUSDC = () => {
        setFieldsValue({
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          token_name: 'USDC',
          market_name: 'USDT',
          precision: 18,
          type: 'stable_coin'
        })
      }

      return { register, 
        onEthWBTC, onEthWETH, onEthUSDC,
        onBscWBTC, onBscWETH, onBscUSDC,
        onOptWBTC, onOptWETH, onOptUSDC,
        onSolanaWBTC, onSolanaWETH, onSolanaUSDC };
    },
  });
</script>
<style lang="less" scoped>
  .step2 {
    width: 450px;
    margin: 0 auto;
  }
</style>
