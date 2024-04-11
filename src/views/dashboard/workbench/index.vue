<template>
  <PageWrapper :class="prefixCls" title="Business">
    <template #headerContent>
      <div :class="`${prefixCls}__link`">
        <a @click="changeType('executing')"><Icon icon="mdi:clipboard-text-history" color="#1890ff" /><span>Executing</span></a> |
        <a @click="changeType('history')"><Icon icon="material-symbols:work-history" color="#1890ff" /><span>History</span></a> |
        <template v-for="item in ammList" :key="item"> 
          <a @click="changeType('amm', item)"><Icon icon="icon-park:history-query" color="#1890ff" /><span>{{item}} History</span></a> | 
        </template>
        
      </div>
    </template>
    <div :class="`${prefixCls}__top`">
      <a-row :gutter="12">
        <a-col :span="8" :class="`${prefixCls}__top-col`">
          <div>Executing</div>
          <p>{{executingNum}} jobs</p>
        </a-col>
        <a-col :span="8" :class="`${prefixCls}__top-col`">
          <div>Failed</div>
          <p>{{failedNum}}</p>
        </a-col>
        <a-col :span="8" :class="`${prefixCls}__top-col`">
          <div>Succeed</div>
          <p>{{succeedNum}}</p>
        </a-col>
      </a-row>
    </div>

    <div :class="`${prefixCls}__content`">
      <a-list :pagination="pagination" :data-source="showData">
        <template #renderItem="{ item }">
          <a-list-item class="list">

            <a-list-item-meta v-if="item.type == 'business'">
              <template #avatar>
                <a-row :gutter="1">
                <a-col :span="12">{{item.src_chain}}</a-col>
                <a-col :span="12">{{item.dst_chain}}</a-col>
                <a-col :span="12">{{item.src_token.substr(0,6)}}...{{item.src_token.substr(item.src_token.length - 6,6)}}</a-col>
                <a-col :span="12">{{item.dst_token.substr(0,6)}}...{{item.dst_token.substr(item.dst_token.length - 6,6)}}</a-col>
                </a-row>
              </template>
               <template #title>
                <span> Price: {{ item.price }}</span>
                <span> Amount: {{ item.src_amount }} -> {{item.dst_amount}}</span>
              </template>
              <template #description>
                <div class="description">
                  TxOut: {{ item.tx_out }}
                </div>
                <div class="description">
                  TxIn: {{ item.tx_in }}
                </div>
                <div class="description">
                  TxOutConfirm: {{ item.tx_out_cfm }}
                </div>
                <div class="description">
                  TxInConfirm: {{ item.tx_in_cfm }}
                </div>
                <div class="description">
                  TxOutRefund: {{ item.tx_out_rfd }}
                </div>
                <div class="description">
                  TxInRefund: {{ item.tx_in_rfd }}
                </div>
              </template>
            </a-list-item-meta>

            <a-list-item-meta v-if="item.type == 'amm'">
              <template #title>
                <span> Market: {{ item.market }}</span>
              </template>
              <template #description>
                <div class="description">
                  capacity: {{ item.capacity }}
                </div>
                <div class="description">
                  orig price: {{ item.origPrice }}
                </div>
                <div class="description">
                  price: {{ item.price }}
                </div>
                <div class="description">
                  native price: {{ item.nativePrice }}
                </div>
                <!-- <div class="description">
                  gas: {{ item.gas }}
                </div> -->
                <div class="description">
                  swapAmount: {{ item.swapAmount }}
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { Progress, Row, Col } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { cardList } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { List } from 'ant-design-vue';
  import { businessHistory, ammHistory } from '/@/api/lpnode/business'
  import { getChainName } from '/@/obridge/utils'
  import { list } from '/@/api/lpnode/base';

  export default defineComponent({
    components: {
      Icon,
      Progress,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup() {

      const executingNum = ref(0)
      const failedNum = ref(0)
      const succeedNum = ref(0)
      const showData = ref([])
      const ammList = ref([])
      let historyType = 'executing'
      let pageNow = 1
      let choosedAmm = ''


      const getAmm = async () => {
        let ammResp = await list({
          installType: 'amm'
        })
        let newArr = []
        ammResp.forEach(element => {
          newArr.push(element.name)
        });
        ammList.value = newArr
      }
      getAmm()

      const getDataAmm = async () => {
        let resp = await ammHistory({
          "status": 1,
          "page": pageNow,
          "pageSize": 5,
          "ammName": choosedAmm
        })
        console.log('resp:')
        console.log(resp)

        let newArr = []
        while (resp.pageCount * 5 > newArr.length){
          newArr.push({})
        }

        let i = (pageNow - 1) * 5
        for (let obj of resp.list) {
          newArr[i] = {
            type: 'amm',
            market: obj.quoteInfo.assetName,
            capacity: obj.quoteInfo.capacity_num,
            nativeMarket: obj.quoteInfo.native_token_symbol,

            gas: obj.quoteInfo.gas,
            nativePrice: obj.quoteInfo.native_token_price,
            price: obj.quoteInfo.price,
            origPrice: obj.quoteInfo.origPrice,
            swapAmount: obj.SwapInfo.inputAmount
          }
          i++
        }
        showData.value = newArr
        console.log(newArr)
      }

      const getDataBusiness = async () => {
        let resp = await businessHistory({
          "status": historyType == 'executing' ? 1 : 2,
          "page": pageNow,
          "pageSize": 5
        })
        console.log('resp:')
        console.log(resp)

        let newArr = []
        while (resp.pageCount * 5 > newArr.length){
          newArr.push({})
        }

        let i = (pageNow - 1) * 5
        for(let obj of resp.list) {

          let txOut = obj.event_transfer_out == null ? null : obj.event_transfer_out.transfer_id
          let txIn = obj.event_transfer_in == null ? null : obj.event_transfer_in.transfer_id
          let txOutCfm = obj.event_transfer_out_confirm == null ? null : obj.event_transfer_out_confirm.transfer_id
          let txInCfm = obj.event_transfer_in_confirm == null ? null : obj.event_transfer_in_confirm.transfer_id
          let txOutRfd = obj.event_transfer_out_refund == null ? null : obj.event_transfer_out_refund.transfer_id
          let txInRfd = obj.event_transfer_in_refund == null ? null : obj.event_transfer_in_refund.transfer_id

          newArr[i] = {
            type: 'business',
            src_chain: getChainName(obj.pre_business.swap_asset_information.quote.quote_base.bridge.src_chain_id),
            dst_chain: getChainName(obj.pre_business.swap_asset_information.quote.quote_base.bridge.dst_chain_id),
            src_token: obj.pre_business.swap_asset_information.quote.quote_base.bridge.src_token,
            dst_token: obj.pre_business.swap_asset_information.quote.quote_base.bridge.dst_token,
            price: obj.pre_business.swap_asset_information.quote.quote_base.price,
            src_amount: obj.pre_business.swap_asset_information.amount,
            dst_amount: obj.pre_business.swap_asset_information.dst_amount,
            tx_out: txOut == null ? 'null' : `${txOut.substr(0,6)}...${txOut.substr(txOut.length - 6,6)}`,
            tx_in: txIn == null ? 'null' : `${txIn.substr(0,6)}...${txIn.substr(txIn.length - 6,6)}`,
            tx_out_cfm: txOutCfm == null ? 'null' : `${txOutCfm.substr(0,6)}...${txOutCfm.substr(txOutCfm.length - 6,6)}`,
            tx_in_cfm: txInCfm == null ? 'null' : `${txInCfm.substr(0,6)}...${txInCfm.substr(txInCfm.length - 6,6)}`,
            tx_out_rfd: txOutRfd == null ? 'null' : `${txOutRfd.substr(0,6)}...${txOutRfd.substr(txOutRfd.length - 6,6)}`,
            tx_in_rfd: txInRfd == null ? 'null' : `${txInRfd.substr(0,6)}...${txInRfd.substr(txInRfd.length - 6,6)}`,
          }
          i++
        }
        showData.value = newArr
      }

      const getDate = async () => {

        if (historyType == 'amm') {
          getDataAmm()
        } else {
          getDataBusiness()
        }


      }
      getDate()

      const changeType = async (type, name) => {
        choosedAmm = name
        historyType = type
        pageNow = 1
        getDate()
      }

      return {
        executingNum,
        failedNum,
        succeedNum,
        changeType,
        ammList,
        
        prefixCls: 'list-basic',
        showData,
        pagination: {
          show: true,
          onChange: (page: number) => {
            console.log(page);
            pageNow = page

            if (historyType != 'executing') {
              getDate()
            }
            
          },
          pageSize: 5,
        },
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-basic {
    &__top {
      padding: 24px;
      text-align: center;
      background-color: @component-background;

      &-col {
        &:not(:last-child) {
          border-right: 1px dashed @border-color-base;
        }

        div {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 22px;
          color: @text-color;
        }

        p {
          margin: 0;
          font-size: 24px;
          line-height: 32px;
          color: @text-color;
        }
      }
    }

    &__content {
      padding: 24px;
      margin-top: 12px;
      background-color: @component-background;

      .list {
        position: relative;
      }

      .icon {
        font-size: 40px !important;
      }

      .extra {
        position: absolute;
        top: 20px;
        right: 15px;
        font-weight: normal;
        color: @primary-color;
        cursor: pointer;
      }

      .description {
        display: inline-block;
        width: 40%;
      }

      .info {
        display: inline-block;
        width: 30%;
        text-align: center;

        div {
          display: inline-block;
          padding: 0 20px;

          span {
            display: block;
          }
        }
      }

      .progress {
        display: inline-block;
        width: 15%;
        vertical-align: top;
      }
    }
  }
</style>
