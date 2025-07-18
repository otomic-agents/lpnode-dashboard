<template>
  <PageWrapper :class="prefixCls" title="Monitor">
    <div :class="`${prefixCls}__content`">
      <a-list>
        <a-row :gutter="16">
          <template v-for="item in pageList" :key="item.title">
            <a-col :span="6">
              <a-list-item>
                <a-card :hoverable="true" :class="`${prefixCls}__card`" @click="showInfo(item)">
                  <div :class="`${prefixCls}__card-title`">
                    <div class="title-content">
                      <component :is="getLogoIcon(item.type)" class="title-icon" />
                      <div class="title-wrapper">
                        <span class="main-title">{{ item.title }}</span>
                        <span class="sub-title">{{ item.type }}</span>
                      </div>
                      <Icon :icon="item.allPassed ? 'ic:round-check-circle' : 'ic:round-error'"
                        :class="['status-icon', item.allPassed ? 'status-success' : 'status-error']" />
                    </div>
                  </div>
                  <div :class="`${prefixCls}__checklist`">
                    <div v-for="check in item.checks" :key="check.name" class="check-line">
                      <CheckCircleFilled v-if="check.status" class="check-icon check-success" />
                      <CloseCircleFilled v-else class="check-icon check-error" />
                      <span class="check-text">{{ check.name }}</span>
                    </div>
                  </div>
                </a-card>
              </a-list-item>
            </a-col>
          </template>
        </a-row>
      </a-list>
    </div>
    <Info @register="register" :data="choosed" />
  </PageWrapper>
</template>

<script lang="ts">
const getLogoIcon = (type: string) => {
  switch (type) {
    case 'Chain Client':
      return 'BlockOutlined';
    case 'AMM Program':
      return 'AppstoreOutlined';
    case 'Index Program':
      return 'BarChartOutlined';
    default:
      return 'AppstoreOutlined';
  }
};
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { Row as RowType, Col as ColType, Card as CardType, Progress as ProgressType, List as ListType } from 'ant-design-vue';
import {
  ApiOutlined,
  BlockOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ClusterOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  ApartmentOutlined,
} from '@ant-design/icons-vue';

const Progress: any = ProgressType;
const Row: any = RowType;
const Col: any = ColType;
const Card: any = CardType;
const List: any = ListType;
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import { PageWrapper } from '/@/components/Page';
import { staustList } from '/@/api/lpnode/base';
import { useDrawer } from '/@/components/Drawer';
import _ from 'lodash';
import Info from './info.vue';

interface CheckItem {
  name: string;
  status: boolean;
  message: string;
}

interface CheckResult {
  checks: CheckItem[];
  allPassed: boolean;
}

function isPositiveInteger(n) {
  return _.isInteger(n) && _.gt(n, 0);
}

const checker = {
  checkBody: (statusData: any) => {
    if (_.get(statusData, 'statusBody', '') == '') {
      return false;
    }
    return true;
  },

  getBodyData: (statusData: any) => {
    let data = undefined;
    try {
      const statusBody = _.get(statusData, 'statusBody', '');
      data = JSON.parse(statusBody);
    } catch (e) { }
    return data;
  },

  'ammClient_Check': async (statusData: any): Promise<CheckResult> => {
    const checks: CheckItem[] = [];

    const hasBody = checker.checkBody(statusData);
    checks.push({
      name: 'Status Data Available',
      status: hasBody,
      message: hasBody ? 'Status data available' : 'No status data'
    });

    if (!hasBody) {
      return { checks, allPassed: false };
    }

    const body = checker.getBodyData(statusData);

    const heightUpdateTime = _.get(body, 'monitorInfo.block_height_update_time', 0);
    const heightUpdateOk = new Date().getTime() - heightUpdateTime <= 1000 * 60;
    checks.push({
      name: 'Block Height Update Time',
      status: heightUpdateOk,
      message: heightUpdateOk ? 'Recent update' : 'Update timeout'
    });

    const chainBlockHeight = _.get(body, 'monitorInfo.chain_block_height', 0);
    const blockHeight = _.get(body, 'monitorInfo.block_height', 0);
    const heightValid = isPositiveInteger(chainBlockHeight) && isPositiveInteger(blockHeight);
    const heightSync = heightValid && (chainBlockHeight - blockHeight <= 100);

    checks.push({
      name: 'Block Height Sync',
      status: heightSync,
      message: heightSync ? 'Synchronized' : 'Not synchronized'
    });

    const allPassed = checks.every(check => check.status);
    return { checks, allPassed };
  },

  'amm_Check': async (statusData: any): Promise<CheckResult> => {
    const checks: CheckItem[] = [];

    const hasBody = checker.checkBody(statusData);
    checks.push({
      name: 'Status Data Available',
      status: hasBody,
      message: hasBody ? 'Status data available' : 'No status data'
    });

    if (!hasBody) {
      return { checks, allPassed: false };
    }

    const body = checker.getBodyData(statusData);

    const bridgeList = _.get(body, 'bridgeTokenList', []);
    const bridgeOk = _.isArray(bridgeList) && bridgeList.length > 0;
    checks.push({
      name: 'Bridge Configuration',
      status: bridgeOk,
      message: bridgeOk ? 'Bridges configured' : 'No bridges'
    });

    const tokenList = _.get(body, 'tokenList', []);
    const tokensOk = _.isArray(tokenList) && tokenList.length > 0;
    checks.push({
      name: 'Token Configuration',
      status: tokensOk,
      message: tokensOk ? 'Tokens configured' : 'No tokens'
    });

    const dexBalance:any = _.get(body, 'dex_balance', []);
    const currentTime = new Date().getTime();
    const threeMinutesInMs = 3 * 60 * 1000; // 3 minutes in milliseconds

    const hasValidBalance = dexBalance.length > 0 &&
      dexBalance.every(balance =>
        'balanceRaw' in balance &&
        'lastUpdate' in balance &&
        (currentTime - balance.lastUpdate) <= threeMinutesInMs
      );
    checks.push({
      name: 'Wallet Balance',
      status: hasValidBalance,
      message: hasValidBalance ? 'Valid balance data' : 'Invalid balance data'
    });

    const lasttime = _.get(body, 'lasttime', 0);
    const heartbeatOk = new Date().getTime() - lasttime <= 1000 * 60;
    checks.push({
      name: 'Heartbeat Status',
      status: heartbeatOk,
      message: heartbeatOk ? 'Active' : 'Timeout'
    });

    const lastQuotationKeep = _.get(body, 'lastQuotationKeep', 0);
    const quotationKeepOk = new Date().getTime() - lastQuotationKeep <= 1000 * 180;
    checks.push({
      name: 'Quotation Keep Status',
      status: quotationKeepOk,
      message: quotationKeepOk ? 'Recent quotation' : 'Outdated quotation'
    });

    const allPassed = checks.every(check => check.status);
    return { checks, allPassed };
  },

  'market_Check': async (statusData: any): Promise<CheckResult> => {
    const checks: CheckItem[] = [];

    const hasBody = checker.checkBody(statusData);
    checks.push({
      name: 'Status Data Available',
      status: hasBody,
      message: hasBody ? 'Status data available' : 'No status data'
    });

    if (!hasBody) {
      return { checks, allPassed: false };
    }

    const body = checker.getBodyData(statusData);
    const orderbook = _.get(body, 'orderbook', {});
    const symbolList = _.get(body, 'symbol_list', []);

    checks.push({
      name: 'Trading Pairs Configuration',
      status: symbolList.length > 0,
      message: symbolList.length > 0 ? 'Pairs configured' : 'No pairs'
    });

    let allSymbolsOk = true;
    console.log('Starting to check all trading pair data...');
    console.log(`Current timestamp: ${new Date().getTime()}, Current time: ${new Date().toISOString()}`);

    symbolList.forEach((symbol) => {
      console.log(`Checking trading pair: ${symbol}`);
      const symbolOrderbook = orderbook[symbol];

      if (symbolOrderbook) {
        const updateTime = _.get(symbolOrderbook, 'timestamp');
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - updateTime;
        const dataFresh = timeDiff <= 1000 * 60 * 3; // 3 minutes

        console.log(`  - Orderbook information for trading pair ${symbol}:`);
        console.log(`    - Update timestamp: ${updateTime}, Update time: ${new Date(updateTime).toISOString()}`);
        console.log(`    - Time difference: ${timeDiff}ms (${Math.round(timeDiff / 1000)} seconds)`);
        console.log(`    - Is data fresh: ${dataFresh ? 'Yes' : 'No'} (Threshold: 180 seconds)`);

        if (!dataFresh) {
          console.log(`    - Warning: Data for ${symbol} is outdated!`);
        }

        allSymbolsOk = allSymbolsOk && dataFresh;
      } else {
        console.log(`  - Error: Cannot find orderbook data for trading pair ${symbol}!`);
        allSymbolsOk = false;
      }
    });

    console.log(`All trading pairs check result: ${allSymbolsOk ? 'All normal' : 'Abnormalities exist'}`);

    checks.push({
      name: 'Market Data Status',
      status: allSymbolsOk,
      message: allSymbolsOk ? 'Data up to date' : 'Data expired'
    });

    const allPassed = checks.every(check => check.status);
    return { checks, allPassed };
  }
};

export default defineComponent({
  name: 'Monitor',
  components: {
    PageWrapper,
    CheckCircleFilled,
    CloseCircleFilled,
    [Card.name]: Card,
    [List.name]: List,
    [List.Item.name]: List.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    Info,
    ApiOutlined,
    BlockOutlined,
    DatabaseOutlined,
    CloudOutlined,
    ClusterOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    ApartmentOutlined,
  },
  setup() {
    const choosed = ref(undefined);
    const pageList: any = ref([]);
    const [register, { openDrawer: openInfo }] = useDrawer();

    const getLogoIcon = (type: string) => {
      switch (type) {
        case 'Chain Client':
          return 'BlockOutlined';  
        case 'AMM Program':
          return 'AppstoreOutlined';
        case 'Index Program':
          return 'BarChartOutlined';
        default:
          return 'AppstoreOutlined';
      }
    };

    const showInfo = (data) => {
      choosed.value = data;
      openInfo(true);
    };

    const fetchList = async () => {
      try {
        const resp: any = await staustList({});
        let newList: any[] = [];

        for (const element of resp) {
          const checkerName = `${element.installType}_Check`;
          if (checker[checkerName]) {
            const checkResult = await checker[checkerName](element);
            newList.push({
              title: element.name.toUpperCase(),
              type: element.installType == 'ammClient'
                ? 'Chain Client'
                : element.installType == 'amm'
                  ? 'AMM Program'
                  : 'Index Program',
              checks: checkResult.checks,
              allPassed: checkResult.allPassed,
              details: element.statusBody,
            });
          }
        }

        pageList.value = newList;
      } catch (error) {
        console.error('Failed to fetch status list:', error);
      }
    };

    let timer: NodeJS.Timer;
    onMounted(() => {
      fetchList();
      timer = setInterval(fetchList, 30000);
    });

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
      }
    });

    return {
      prefixCls: 'list-card',
      pageList,

      register,
      showInfo,
      choosed,
      getLogoIcon,
    };
  },
});
</script>
<style lang="less" scoped>
@prefix-cls: ~'list-card';

.@{prefix-cls} {
  &__content {
    padding: 12px;
  }

  &__card {
    width: 100%;
    background: #fff;
    border-radius: 4px;
    height: 320px;
    display: flex;
    flex-direction: column;

    :deep(.ant-card-body) {
      padding: 16px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    &-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 12px;
      flex-shrink: 0;

      .title-content {
        display: flex;
        align-items: center;
        gap: 8px;

        .title-icon {
          font-size: 24px;
          color: #1890ff;
          flex-shrink: 0;
        }

        .title-wrapper {
          flex: 1;
          display: flex;
          align-items: baseline;
          gap: 8px;
          overflow: hidden;

          .main-title {
            font-size: 16px;
            font-weight: 500;
            color: #1f1f1f;
            white-space: nowrap;
          }

          .sub-title {
            font-size: 12px;
            font-weight: normal;
            color: #999;
            white-space: nowrap;
          }
        }

        .status-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .status-success {
          color: #52c41a;
        }

        .status-error {
          color: #ff4d4f;
        }
      }
    }

    &-detail {
      color: #666;
      margin-bottom: 12px;
      font-size: 14px;
      flex-shrink: 0;
    }
  }

  &__checklist {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;

    .check-line {
      line-height: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;

      .check-icon {
        font-size: 16px;
      }

      .check-success {
        color: #52c41a;
      }

      .check-error {
        color: #ff4d4f;
      }

      .check-text {
        color: #333;
        font-size: 13px;
      }
    }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #666;
    }
  }
}

@media screen and (max-width: 1200px) {
  .@{prefix-cls} {
    &__card {
      margin-bottom: 12px;
    }
  }
}
</style>