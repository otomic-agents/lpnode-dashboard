<template>
  <div class="step2">

    <a-row :gutter="24">
      <a-col :span="1" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onEthOBTC"> eth-oBTC </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onEthOETH"> eth-oETH </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onEthOUSDC"> eth-oUSDC </a-button> 
      </a-col>
      <a-col :span="1" ></a-col>
    </a-row>
    
    <a-row :gutter="24">
      <a-col :span="1" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onAvaxOBTC"> avax-oBTC </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onAvaxOETH"> avax-oETH </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onAvaxOUSDC"> avax-oUSDC </a-button> 
      </a-col>
      <a-col :span="1" ></a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="1" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onPolygonOBTC"> polygon-oBTC </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onPolygonOETH"> polygon-oETH </a-button> 
      </a-col>

      <a-col :span="2" ></a-col>
      <a-col :span="6" >
        <a-button type="primary" @click="onPolygonOUSDC"> polygon-oUSDC </a-button>
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

      const onEthOBTC = () => {
        setFieldsValue({
          address: '0x30DfEC4d5Cd6f819492A04c34E20f5F15171e934',
          token_name: 'oBTC',
          market_name: 'BTC',
          precision: 18,
          type: 'coin'
        })
      }

      const onEthOETH = () => {
        setFieldsValue({
          address: '0x1016A0886b4AeD69043367d501a99cfBAaB052B5',
          token_name: 'oETH',
          market_name: 'ETH',
          precision: 18,
          type: 'coin'
        })
      }

      const onEthOUSDC = () => {
        setFieldsValue({
          address: '0xFC0894Eb1ea1876ddC183578F37AFe64bFFAdBd0',
          token_name: 'oUSDC',
          market_name: 'USDC',
          precision: 18,
          type: 'stable_coin'
        })
      }

      const onAvaxOBTC = () => {
        setFieldsValue({
          address: '0x0A327833232Ec4c88DbFa0ae6E44b31D6956088e',
          token_name: 'oBTC',
          market_name: 'BTC',
          precision: 18,
          type: 'coin'
        })
      }

      const onAvaxOETH = () => {
        setFieldsValue({
          address: '0xB526be0B8AeD308892160914B0F25f60Ad3678D7',
          token_name: 'oETH',
          market_name: 'ETH',
          precision: 18,
          type: 'coin'
        })
      }

      const onAvaxOUSDC = () => {
        setFieldsValue({
          address: '0x43e2F9124Ec363A71193bD4fFB1ae6D608185147',
          token_name: 'oUSDC',
          market_name: 'USDC',
          precision: 18,
          type: 'stable_coin'
        })
      }

      const onPolygonOBTC = () => {
        setFieldsValue({
          address: '0x7e36F06Ee6D27b123e8A1fDCBa27F04b56eFb1d5',
          token_name: 'oBTC',
          market_name: 'BTC',
          precision: 18,
          type: 'coin'
        })
      }

      const onPolygonOETH = () => {
        setFieldsValue({
          address: '0xD511B82FC31eCcDeFBe558552d9fe8b7a4e932b6',
          token_name: 'oETH',
          market_name: 'ETH',
          precision: 18,
          type: 'coin'
        })
      }

      const onPolygonOUSDC = () => {
        setFieldsValue({
          address: '0x25B28e17e75F44fF2275F2ba8923ce69CECa73D8',
          token_name: 'oUSDC',
          market_name: 'USDC',
          precision: 18,
          type: 'stable_coin'
        })
      }

      return { register, 
        onEthOBTC, onEthOETH, onEthOUSDC, 
        onAvaxOBTC, onAvaxOETH, onAvaxOUSDC,
        onPolygonOBTC, onPolygonOETH, onPolygonOUSDC };
    },
  });
</script>
<style lang="less" scoped>
  .step2 {
    width: 450px;
    margin: 0 auto;
  }
</style>
