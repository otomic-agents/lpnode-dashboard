<template>
  <PageWrapper :class="prefixCls" title="Business">
    <template #headerContent>
      <div :class="`${prefixCls}__link`">
        <a @click="changeType('executing')"
          ><Icon icon="mdi:clipboard-text-history" color="#1890ff" /><span>Executing</span></a
        >
        |
        <a @click="changeType('history')"
          ><Icon icon="material-symbols:work-history" color="#1890ff" /><span>History</span></a
        >
        |
        <template v-for="item in ammList" :key="item">
          <a @click="changeType('amm', item)"
            ><Icon icon="icon-park:history-query" color="#1890ff" /><span
              >{{ item }} History</span
            ></a
          >
          |
        </template>
      </div>
    </template>
    <div :class="`${prefixCls}__top`">
      <a-row :gutter="12">
        <a-col :span="8" :class="`${prefixCls}__top-col`">
          <div>Executing</div>
          <p>{{ executingNum }} jobs</p>
        </a-col>
        <a-col :span="8" :class="`${prefixCls}__top-col`">
          <div>Failed</div>
          <p>{{ failedNum }}</p>
        </a-col>
        <a-col :span="8" :class="`${prefixCls}__top-col`">
          <div>Succeed</div>
          <p>{{ succeedNum }}</p>
        </a-col>
      </a-row>
    </div>

    <div :class="`${prefixCls}__content`">
      <a-list :pagination="pagination" :data-source="showData">
        <template #renderItem="{ item }">
          <div :gutter="24" v-if="item.type == 'business'">
            <a-row :gutter="24">
              <a-card :hoverable="true" :class="`${prefixCls}__card`">
                <div :class="`${prefixCls}__card-title`"
                  >{{ item.src_chain }} - {{ item.dst_chain }}&nbsp;&nbsp;{{ item.src_token_name }}
                  -
                  {{ item.dst_token_name }}
                </div>
                <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                <div :class="`${prefixCls}__card-detail`">
                  <a-row :gutter="24"
                    ><a-col :span="12">
                      <span
                        >Quote info price: {{ item.price }} Time :{{ item.quote_timestamp }}</span
                      ></a-col
                    ><a-col :span="8"></a-col
                  ></a-row>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <!-- <span>Token info:{{ item.src_token }}-{{ item.dst_token }}</span
                    ><br /> -->
                      <span>Received: {{ item.src_token_name }} {{ item.receiver_amount }} </span
                      ><br />
                      <span>Pay: {{ item.dst_token_name }} {{ item.payment_amount }}</span
                      ><br />
                      <span
                        >Pay: {{ item.dst_chain_native_token_name }}
                        {{ item.payment_native_amount }}</span
                      ><br />
                      <span>Received wallet: {{ item.receiver_wallet }}</span
                      ><br />
                      <span>Pay wallet: {{ item.payment_wallet }}</span
                      ><br />
                    </a-col>
                    <a-col :span="8">
                      <span
                        >User transfer in:
                        <a :href="item.tx_out_link" target="_blank">{{ item.tx_out }}</a> </span
                      ><br />
                      <span
                        >LP transfer in:
                        <a :href="item.tx_in_link" target="_blank">{{ item.tx_in }}</a></span
                      ><br />
                      <span
                        >User transfer in confirmation:
                        <a :href="item.tx_out_cfm_link" target="_blank">{{
                          item.tx_out_cfm
                        }}</a></span
                      ><br />
                      <span
                        >LP transfer in confirmation:
                        <a :href="item.tx_in_cfm_link" target="_blank">{{
                          item.tx_in_cfm
                        }}</a> </span
                      ><br />
                      <span>User refund: {{ item.tx_out_rfd }}</span
                      ><br />
                      <span>Lp refund: {{ item.tx_in_rfd }}</span
                      ><br />
                    </a-col>
                  </a-row>
                </div>
              </a-card>
            </a-row>
          </div>
          <div :gutter="24" v-if="item.type == 'amm'">
            <a-card :hoverable="true" :class="`${prefixCls}__card`">
              <div :class="`${prefixCls}__card-title`">{{ item.market }} </div>
              <!-- <Icon class="icon" icon="material-symbols:work-history" /> -->

              <span> Market: {{ item.market }}</span
              ><br />
              <span>quote Time: {{ item.quoteTime }}</span
              ><br />
              <span>swapAmount: {{ item.swapAmount }}</span
              ><br />
              <span>hedgeEnabled: {{ item.hedgeEnabled }}</span
              ><br />
              <span>capacity: {{ item.capacity }} </span><br />
              <span>orig price: {{ item.origPrice }} </span><br />
              <span>price: {{ item.price }} </span><br />
              <span>capacity: {{ item.capacity }} </span><br />
              <span>native price: {{ item.nativePrice }}</span
              ><br />
            </a-card>
          </div>
        </template>
      </a-list>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { Progress, Row, Col, Card } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { cardList } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { List } from 'ant-design-vue';
  import { businessHistory, ammHistory } from '/@/api/lpnode/business';
  import { getChainName } from '/@/obridge/utils';
  import { list } from '/@/api/lpnode/base';
  import _ from 'lodash';

  export default defineComponent({
    components: {
      Icon,
      Progress,
      PageWrapper,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup() {
      const executingNum = ref(0);
      const failedNum = ref(0);
      const succeedNum = ref(0);
      const showData = ref([]);
      const ammList = ref([]);
      let historyType = 'executing';
      let pageNow = 1;
      let choosedAmm = '';

      const getAmm = async () => {
        let ammResp = await list({
          installType: 'amm',
        });
        let newArr = [];
        ammResp.forEach((element) => {
          newArr.push(element.name);
        });
        ammList.value = newArr;
      };
      getAmm();

      const getDataAmm = async () => {
        let resp = await ammHistory({
          status: 1,
          page: pageNow,
          pageSize: 5,
          ammName: choosedAmm,
        });
        console.log('resp:');
        console.log(resp);

        let newArr = [];
        while (resp.pageCount * 5 > newArr.length) {
          newArr.push({});
        }

        let i = (pageNow - 1) * 5;
        for (let obj of resp.list) {
          newArr[i] = {
            type: 'amm',
            market: obj.quoteInfo.assetName,
            capacity: obj.quoteInfo.capacity_num,
            nativeMarket: obj.quoteInfo.native_token_symbol,
            quoteTimestamp: obj.quoteInfo.timestamp,
            quoteTime: (() => {
              return new Date(obj.quoteInfo.timestamp).toLocaleString();
            })(),
            hedgeEnabled: (() => {
              if (obj.hedgeEnabled == false) {
                return 'no';
              } else {
                return 'yes';
              }
            })(),
            gas: obj.quoteInfo.gas,
            nativePrice: obj.quoteInfo.native_token_price,
            price: obj.quoteInfo.price,
            origPrice: obj.quoteInfo.origPrice,
            swapAmount: obj.SwapInfo.inputAmount,
          };
          i++;
        }
        showData.value = newArr;
        console.log(newArr);
      };

      const getDataBusiness = async () => {
        let resp = await businessHistory({
          status: historyType == 'executing' ? 1 : 2,
          page: pageNow,
          pageSize: 5,
        });
        console.log('resp:');
        console.log(resp);

        let newArr = [];
        while (resp.pageCount * 5 > newArr.length) {
          newArr.push({});
        }

        let i = (pageNow - 1) * 5;
        for (let obj of resp.list) {
          let txOut = obj.event_transfer_out == null ? null : obj.event_transfer_out.transfer_id;
          let txOutInfo =
            obj.event_transfer_out == null ? null : obj.event_transfer_out.transfer_info;
          let txIn = obj.event_transfer_in == null ? null : obj.event_transfer_in.transfer_id;
          let txInInfo = obj.event_transfer_in == null ? null : obj.event_transfer_in.transfer_info;
          let txOutCfm =
            obj.event_transfer_out_confirm == null
              ? null
              : obj.event_transfer_out_confirm.transfer_id;
          let txOutCfmInfo =
            obj.event_transfer_out_confirm == null
              ? null
              : obj.event_transfer_out_confirm.transfer_info;
          let txInCfm =
            obj.event_transfer_in_confirm == null
              ? null
              : obj.event_transfer_in_confirm.transfer_id;
          let txInCfmInfo =
            obj.event_transfer_in_confirm == null
              ? null
              : obj.event_transfer_in_confirm.transfer_info;
          let txOutRfd =
            obj.event_transfer_out_refund == null ? '' : obj.event_transfer_out_refund.transfer_id;
          let txOutRfdInfo =
            obj.event_transfer_out_refund == null
              ? ''
              : obj.event_transfer_out_refund.transfer_info;
          let txInRfd =
            obj.event_transfer_in_refund == null ? '' : obj.event_transfer_in_refund.transfer_id;
          let txInRfdInfo =
            obj.event_transfer_in_refund == null ? '' : obj.event_transfer_in_refund.transfer_info;
          newArr[i] = {
            type: 'business',
            src_chain: getChainName(
              obj.pre_business.swap_asset_information.quote.quote_base.bridge.src_chain_id,
            ),
            dst_chain: getChainName(
              obj.pre_business.swap_asset_information.quote.quote_base.bridge.dst_chain_id,
            ),
            src_token: obj.pre_business.swap_asset_information.quote.quote_base.bridge.src_token,
            dst_token: obj.pre_business.swap_asset_information.quote.quote_base.bridge.dst_token,
            quote_timestamp: (() => {
              if (obj.ViewInfo.quoteTimestamp) {
                return new Date(obj.ViewInfo.quoteTimestamp).toLocaleString();
              }
              return '';
            })(),
            src_token_name: obj.ViewInfo.srcTokenName,
            dst_token_name: obj.ViewInfo.dstTokenName,
            dst_chain_native_token_name: obj.ViewInfo.DstChainNativeTokenName,
            receiver_amount: obj.ViewInfo.receiverAmount,
            payment_amount: obj.ViewInfo.paymentAmount,
            src_chain_name: obj.ViewInfo.srcChainName,
            dst_chain_name: obj.ViewInfo.dstChainName,
            payment_wallet: obj.ViewInfo.paymentWallet,
            receiver_wallet: obj.ViewInfo.receiverWallet,
            payment_native_amount: obj.ViewInfo.paymentNativeAmount,

            price: obj.pre_business.swap_asset_information.quote.quote_base.price,
            src_amount: obj.pre_business.swap_asset_information.amount,
            dst_amount: obj.pre_business.swap_asset_information.dst_amount,
            tx_out: (() => {
              return `${txOut.substr(0, 6)}...${txOut.substr(txOut.length - 6, 6)}`;
            })(),
            tx_out_link: (() => {
              try {
                const txView = JSON.parse(txOutInfo);
                const txHash = _.get(txView, 'transactionHash', '');
                return obj.ViewInfo.srcChainRpcTx.replace('{tx}', txHash);
              } catch (e) {
                return '';
              }
            })(),
            tx_in:
              txIn == null ? 'null' : `${txIn.substr(0, 6)}...${txIn.substr(txIn.length - 6, 6)}`,
            tx_in_link: (() => {
              try {
                const txView = JSON.parse(txInInfo);
                const txHash = _.get(txView, 'transactionHash', '');
                return obj.ViewInfo.dstChainRpcTx.replace('{tx}', txHash);
              } catch (e) {
                return '';
              }
            })(),
            tx_out_cfm:
              txOutCfm == null
                ? 'null'
                : `${txOutCfm.substr(0, 6)}...${txOutCfm.substr(txOutCfm.length - 6, 6)}`,
            tx_out_cfm_link: (() => {
              try {
                const txView = JSON.parse(txOutCfmInfo);
                const txHash = _.get(txView, 'transactionHash', '');
                return obj.ViewInfo.srcChainRpcTx.replace('{tx}', txHash);
              } catch (e) {
                return '';
              }
            })(),
            tx_in_cfm:
              txInCfm == null
                ? 'null'
                : `${txInCfm.substr(0, 6)}...${txInCfm.substr(txInCfm.length - 6, 6)}`,
            tx_in_cfm_link: (() => {
              try {
                const txView = JSON.parse(txInCfmInfo);
                const txHash = _.get(txView, 'transactionHash', '');
                return obj.ViewInfo.dstChainRpcTx.replace('{tx}', txHash);
              } catch (e) {
                return '';
              }
            })(),
            tx_out_rfd:
              txOutRfd == null
                ? 'null'
                : `${txOutRfd.substr(0, 6)}...${txOutRfd.substr(txOutRfd.length - 6, 6)}`,
            tx_out_rfd_link: (() => {
              try {
                const txView = JSON.parse(txOutRfdInfo);
                const txHash = _.get(txView, 'transactionHash', '');
                return obj.ViewInfo.dstChainRpcTx.replace('{tx}', txHash);
              } catch (e) {
                return '';
              }
            })(),
            tx_in_rfd:
              txInRfd == null
                ? 'null'
                : `${txInRfd.substr(0, 6)}...${txInRfd.substr(txInRfd.length - 6, 6)}`,
            tx_in_rfd_link: (() => {
              try {
                const txView = JSON.parse(txInRfdInfo);
                const txHash = _.get(txView, 'transactionHash', '');
                return obj.ViewInfo.dstChainRpcTx.replace('{tx}', txHash);
              } catch (e) {
                return '';
              }
            })(),
          };
          i++;
        }
        showData.value = newArr;
      };

      const getDate = async () => {
        if (historyType == 'amm') {
          getDataAmm();
        } else {
          getDataBusiness();
        }
      };
      getDate();

      const changeType = async (type, name) => {
        choosedAmm = name;
        historyType = type;
        pageNow = 1;
        getDate();
      };

      return {
        // prefixCls: 'list-card',
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
            pageNow = page;

            if (historyType != 'executing') {
              getDate();
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
    &__link {
      margin-top: 10px;
      font-size: 14px;

      a {
        margin-right: 30px;
      }

      span {
        margin-left: 5px;
      }
    }

    &__card {
      width: 100%;
      margin-bottom: 15px;

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: 500;
        color: @text-color;

        .icon {
          margin-top: -5px;
          margin-right: 10px;
          font-size: 38px !important;
        }
      }

      &-detail {
        padding-top: 10px;
        padding-left: 30px;
        font-size: 14px;
        color: @text-color-secondary;
        span {
          line-height: 30px;
          color: black;
        }
      }
    }
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
