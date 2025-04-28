<template>
  <PageWrapper :class="prefixCls" title="Business">
    <template #headerContent>
      <div :class="`${prefixCls}__link`">
        <a @click="changeType('history', '')">
          <Icon icon="material-symbols:work-history" color="#1890ff" /><span>History</span>
        </a>
        |
        <template v-for="item in ammList" :key="item">
          <a @click="changeType('amm', item)">
            <Icon icon="icon-park:history-query" color="#1890ff" /><span>{{ item }} History</span>
          </a>
          |
        </template>
      </div>
    </template>

    <div :class="`${prefixCls}__content`">
      <a-list :pagination="pagination" :data-source="showData">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :hoverable="true" :class="`${prefixCls}__card`">
              <template v-if="item.type === 'business'">
                <div :class="`${prefixCls}__card-title`">
                  <div class="chain-info">
                    <div class="chain-pair">
                      <img :src="ChainLogos[item.source_chain] || DEFAULT_CHAIN_LOGO" class="chain-logo" />
                      <span>{{ item.source_chain }}</span>
                      <Icon icon="material-symbols:arrow-right-alt" />
                      <img :src="ChainLogos[item.destination_chain] || DEFAULT_CHAIN_LOGO" class="chain-logo" />
                      <span>{{ item.destination_chain }}</span>
                    </div>
                  </div>
                  <span :style="{ color: item.status === 'Success' ? '#52c41a' : '#f5222d' }">
                    {{ item.status }}
                  </span>
                </div>
                <div :class="`${prefixCls}__card-detail`">
                  <a-row :gutter="24">
                    <a-col :span="24">
                      <div class="detail-item">
                        <span class="label">Transaction ID:</span>
                        <span class="value">{{ item.transaction_id }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Time:</span>
                        <span class="value">{{ item.transaction_time }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Trade Status:</span>
                        <span class="value">{{ item.trade_status }}</span>
                      </div>
                      <template v-if="item.received && item.received.length">
                        <div class="detail-item">
                          <span class="label">Received:</span>
                          <span class="value">
                            <template v-for="(rec, index) in item.received" :key="index">
                              <span class="token-text">{{ rec.amount }} {{ rec.symbol }}</span>
                            </template>
                          </span>
                        </div>
                      </template>
                      <template v-if="item.pay && item.pay.length">
                        <div class="detail-item">
                          <span class="label">Pay:</span>
                          <span class="value">
                            <template v-for="(pay, index) in item.pay" :key="index">
                              <span class="token-text">{{ pay.amount }} {{ pay.symbol }}</span>
                            </template>
                          </span>
                        </div>
                      </template>
                      <template v-if="item.gas_fee && item.gas_fee.length">
                        <div class="detail-item">
                          <span class="label">Gas Fee:</span>
                          <span class="value">
                            <template v-for="(gas, index) in item.gas_fee" :key="index">
                              {{ gas.amount }} {{ gas.symbol }} (${{ gas.usd }})
                            </template>
                          </span>
                        </div>
                      </template>
                      <template v-if="item.total_changes && item.total_changes.length">
                        <div class="detail-item">
                          <span class="label">Total Changes:</span>
                          <span class="value">
                            <template v-for="(change, _) in item.total_changes" :key="index">
                              <span class="token-text" :style="{
                                color: change.amount > 0 ? '#52c41a' : '#f5222d',
                                marginRight: '10px'
                              }">
                                {{ change.amount > 0 ? '+' : '' }}{{ Number(change.amount).toFixed(8) }} {{
                                  change.symbol }}
                                <template v-if="change.usd">
                                  (${{ change.usd }})
                                </template>
                              </span>
                            </template>
                          </span>
                        </div>
                      </template>
                      <template v-if="item.chain_transactions && item.chain_transactions.length">
                        <div class="detail-item transactions-container">
                          <span class="label">Chain Transactions:</span>
                          <div class="value transactions-list">
                            <div class="transactions-wrapper">
                              <template v-for="(tx, index) in item.chain_transactions" :key="index">
                                <div class="transaction-item" :class="getTransactionClass(tx.event_name)">
                                  <div class="transaction-header">
                                    <span class="event-name">{{ tx.event_name }}</span>
                                    <span class="chain-name">{{ tx.chain_name }}</span>
                                  </div>
                                  <div class="transaction-hash">
                                    <a :href="tx.explorer_url" target="_blank" class="hash-link">
                                      <span class="hash-text">{{ formatTxHash(tx.tx_hash) }}</span>
                                      <Icon icon="material-symbols:open-in-new" class="external-link-icon" />
                                    </a>
                                  </div>
                                  <div class="transaction-time">
                                    {{ formatTimestamp(tx.timestamp) }}
                                  </div>
                                </div>
                                <div v-if="index !== item.chain_transactions.length - 1" class="transaction-arrow">
                                  <Icon icon="material-symbols:arrow-right-alt" />
                                </div>
                              </template>
                            </div>
                          </div>
                        </div>
                      </template>
                    </a-col>
                  </a-row>
                </div>
              </template>

              <template v-if="item.type === 'amm'">
                <div :class="`${prefixCls}__card-title`">{{ item.market }}</div>
                <div :class="`${prefixCls}__card-detail`">
                  <div class="detail-item">
                    <span class="label">Market:</span>
                    <span class="value">{{ item.market }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Quote Time:</span>
                    <span class="value">{{ item.quoteTime }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Swap Amount:</span>
                    <span class="value">{{ item.swapAmount }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Hedge Enabled:</span>
                    <span class="value">{{ item.hedgeEnabled }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Capacity:</span>
                    <span class="value">{{ item.capacity }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Original Price:</span>
                    <span class="value">{{ item.origPrice }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Price:</span>
                    <span class="value">{{ item.price }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Native Price:</span>
                    <span class="value">{{ item.nativePrice }}</span>
                  </div>
                </div>
              </template>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
import { Row as RowType, Col as ColType, Card as CardType, Progress as ProgressType, List as ListType } from 'ant-design-vue';

const Progress: any = ProgressType;
const Row: any = RowType;
const Col: any = ColType;
const Card: any = CardType;
const List: any = ListType;
import { ChainLogos, DEFAULT_CHAIN_LOGO } from '/@/assets/chainLogos';
import { defineComponent, ref } from 'vue';
import Icon from '/@/components/Icon/index';
import { PageWrapper } from '/@/components/Page';
import { businessHistory, ammHistory } from '/@/api/lpnode/business';
//@ts-ignore
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
    const formatTxHash = (hash: string) => {
      if (!hash) return '';
      return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };
    const getTransactionClass = (eventName: string) => {
      switch (eventName) {
        case 'TransferOut':
          return 'transfer-out';
        case 'TransferOutConfirm':
          return 'transfer-out-confirm';
        case 'TransferIn':
          return 'transfer-in';
        case 'TransferInConfirm':
          return 'transfer-in-confirm';
        case 'TransferInRefund':
          return 'transfer-refund';


        case 'InitSwap':
          return 'init-swap';
        case 'ConfirmSwap':
          return 'confirm-swap';
        case 'RefundSwap':
          return 'refund-swap';
        default:
          return '';
      }
    };
    const formatTimestamp = (timestamp: number) => {
      return new Date(timestamp).toLocaleString();
    };
    const pagination = ref({
      show: true,
      total: 0,
      current: 1,
      pageSize: 5,
      onChange: (page: number) => {
        pageNow = page;
        getDate();
      },
    });

    const showData = ref<any[]>([]);
    const ammList = ref<string[]>([]);
    let historyType = 'executing';
    let pageNow = 1;
    let choosedAmm = '';

    const getAmm = async () => {
      let ammResp = await list({
        installType: 'amm',
      });
      let newArr: string[] = [];
      ammResp.forEach((element) => {
        newArr.push(element.name);
      });
      ammList.value = newArr;
    };
    getAmm();

    const getDataAmm = async () => {
      let resp: any = await ammHistory({
        status: 1,
        page: pageNow,
        pageSize: 5,
        ammName: choosedAmm,
      });
      console.log('resp:', resp);

      if (resp.list && _.isArray(resp.list)) {
        const newArr = resp.list.map((obj) => ({
          type: 'amm',
          market: obj.quoteInfo.assetName,
          capacity: obj.quoteInfo.capacity_num,
          nativeMarket: obj.quoteInfo.native_token_symbol,
          quoteTimestamp: obj.quoteInfo.timestamp,
          quoteTime: new Date(obj.quoteInfo.timestamp).toLocaleString(),
          hedgeEnabled: obj.hedgeEnabled === false ? 'no' : 'yes',
          gas: obj.quoteInfo.gas,
          nativePrice: obj.quoteInfo.native_token_price,
          price: obj.quoteInfo.price,
          origPrice: obj.quoteInfo.origPrice,
          swapAmount: obj.SwapInfo.inputAmount,
        }));

        showData.value = newArr;


        pagination.value = {
          ...pagination.value,
          total: resp.pageCount * 5,
          current: pageNow,
          pageSize: 5,
          onChange: (page: number) => {
            pageNow = page;
            getDate();
          },
        };
      } else {

        showData.value = [];
        pagination.value = {
          ...pagination.value,
          total: 0,
          current: 1,
        };
      }
    };

    const getDataBusiness = async () => {
      let resp: any = await businessHistory({
        status: 2,
        page: pageNow,
        pageSize: 5,
      });

      console.log("getDataBusiness:");
      console.log(JSON.stringify(resp));

      if (resp.list && _.isArray(resp.list)) {
        const newArr = await Promise.all(resp.list.map(async (obj) => {
          return {
            type: 'business',
            transaction_id: obj.transaction_id,
            transaction_time: obj.transaction_time,
            status: obj.status,
            trade_status: obj.trade_status,
            source_chain: obj.source_chain,
            destination_chain: obj.destination_chain,
            received: obj.received,
            pay: obj.pay,
            gas_fee: obj.gas_fee,
            chain_transactions: obj.chain_transactions,
            total_changes: obj.total_changes,
          };
        }));

        showData.value = newArr;

        pagination.value = {
          ...pagination.value,
          total: resp.pageCount * 5,
          current: pageNow,
          pageSize: 5,
          onChange: (page: number) => {
            pageNow = page;
            getDate();
          },
        };
      }
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
      changeType,
      ammList,
      ChainLogos,
      DEFAULT_CHAIN_LOGO,
      prefixCls: 'list-basic',
      showData,
      pagination,
      formatTxHash,
      formatTimestamp,
      getTransactionClass,
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

  &__card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .chain-info {
      .chain-pair {
        display: flex;
        align-items: center;
        gap: 8px;

        .chain-logo {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
      }
    }
  }

  &__card {
    width: 100%;
    margin-bottom: 15px;

    .ant-card-body {
      padding: 16px;
    }

    &-title {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    &-detail {
      padding-top: 10px;
      padding-left: 30px;
      font-size: 14px;

      .detail-item {
        &:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        margin-bottom: 10px;
        line-height: 1.6;
        display: flex; 
        align-items: center; 

        .label {
          font-weight: 500;
          color: #666;
          margin-right: 8px;
          min-width: 100px;
        }

        .value {
          color: #333;
          display: flex; 
          align-items: center; 
          flex-wrap: wrap; 
          gap: 8px; 
        }
      }
    }
  }

  &__content {
    padding: 24px;
    margin-top: 12px;
    background-color: #fff;
  }
}

.token-logo {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}

.token-text {
  display: inline-block;
  vertical-align: middle;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.02);
  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }
}

.transactions-container {
  .transactions-list {
    width: 100%;
    overflow-x: auto;
    padding: 8px 0;

    .transactions-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px;
    }
  }

  .transaction-item {
    flex: 0 0 auto;
    min-width: 280px;
    padding: 12px;
    border-radius: 8px;
    background-color: #f8f9fa;
    border-left: 4px solid #e9ecef;

    &.transfer-out {
      border-left-color: #40a9ff;
      background-color: #e6f7ff;
    }

    &.transfer-out-confirm {
      border-left-color: #1890ff;
      background-color: #f0f5ff;
    }

    &.transfer-in {
      border-left-color: #52c41a;
      background-color: #f6ffed;
    }

    &.transfer-in-confirm {
      border-left-color: #389e0d;
      background-color: #f0f9eb;
    }

    &.transfer-refund {
      border-left-color: #faad14;
      background-color: #fff7e6;
    }

    &.init-swap {
      border-left-color: #722ed1;
      background-color: #f9f0ff;
    }

    &.confirm-swap {
      border-left-color: #13c2c2;
      background-color: #e6fffb;
    }

    &.refund-swap {
      border-left-color: #f5222d;
      background-color: #fff1f0;
    }

    .transaction-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .event-name {
        font-weight: 500;
        color: #1f1f1f;
      }

      .chain-name {
        color: #666;
        font-size: 0.9em;
        background: rgba(0, 0, 0, 0.06);
        padding: 2px 8px;
        border-radius: 4px;
      }
    }

    .transaction-hash {
      margin-bottom: 4px;

      .hash-link {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #1890ff;

        &:hover {
          color: #40a9ff;
        }

        .hash-text {
          font-family: monospace;
        }

        .external-link-icon {
          font-size: 14px;
        }
      }
    }

    .transaction-time {
      font-size: 0.9em;
      color: #8c8c8c;
    }
  }

  .transaction-arrow {
    flex: 0 0 auto;
    color: #8c8c8c;
    font-size: 24px;
    display: flex;
    align-items: center;
  }
}

.transactions-list {
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f2f5;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;

    &:hover {
      background: #999;
    }
  }
}
</style>
