<template>
  <PageWrapper :class="prefixCls" title="Moniter">
    <template #headerContent>
      <div :class="`${prefixCls}__link`"> </div>
    </template>

    <div :class="`${prefixCls}__content`">
      <a-list>
        <a-row :gutter="16">
          <template v-for="item in pageList" :key="item.title">
            <a-col :span="6">
              <a-list-item>
                <a-card :hoverable="true" :class="`${prefixCls}__card`" @click="showInfo(item)">
                  <div :class="`${prefixCls}__card-title`">
                    <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                    {{ item.title }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    {{ item.type }}
                  </div>
                  <!-- <div :class="`${prefixCls}__card-detail`">
                    {{ item.clientInfo.deployment.image }}
                  </div> -->
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
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { cardList } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { Card, Row, Col, List } from 'ant-design-vue';
  import { staustList } from '/@/api/lpnode/base';
  import { ListModel } from '/@/api/lpnode/model/baseModel';
  import { useDrawer } from '/@/components/Drawer';
  import _ from 'lodash';
  import Info from './info.vue';
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
      } catch (e) {}

      return data;
    },
  };

  checker['ammClient_Check'] = async (statusData: any) => {
    if (!checker.checkBody(statusData)) {
      return 'stateless data';
    }
    const body = checker.getBodyData(statusData);
    console.log(body);
    const heightUpdateTime = _.get(body, 'monitorInfo.block_height_update_time', 0);
    console.log(new Date().getTime() - heightUpdateTime, 1000 * 60, 'diff');
    if (new Date().getTime() - heightUpdateTime > 1000 * 60) {
      console.error('height not synchronized in time.');
      return 'height not synchronized in time.';
    }
    const chainBlockHeight = _.get(body, 'monitorInfo.chain_block_height', 0);
    const blockHeight = _.get(body, 'monitorInfo.block_height', 0);
    if (!isPositiveInteger(chainBlockHeight) || !isPositiveInteger(blockHeight)) {
      console.error('height not synchronized in time.');
      return 'height not synchronized in time.';
    }
    console.log('-----------------', chainBlockHeight, blockHeight, chainBlockHeight - blockHeight);
    if (chainBlockHeight - blockHeight > 100) {
      console.error('height not synchronized in time. chainBlockHeight - blockHeight');
      return 'height not synchronized in time. chainBlockHeight - blockHeight';
    }
    const watcherList = _.get(body, 'monitorInfo.watcher', []);
    if (watcherList.length < 5) {
      console.error('watcher length error');
      return 'watcher length error';
    }
    return true;
  };
  checker['amm_Check'] = async (statusData: any) => {
    if (!checker.checkBody(statusData)) {
      return 'stateless data';
    }
    const body = checker.getBodyData(statusData);
    console.log(body);
    const bridgeList = _.get(body, 'bridgeTokenList', []);
    if (!_.isArray(bridgeList) || bridgeList.length <= 0) {
      return 'please configure the bridge';
    }
    const tokenList = _.get(body, 'tokenList', []);
    if (!_.isArray(tokenList) || tokenList.length <= 0) {
      return 'Please add tokens.';
    }
    const lasttime = _.get(body, 'lasttime', 0);
    if (new Date().getTime() - lasttime > 1000 * 60) {
      return 'heartbeat protocol timeout';
    }
    return true;
  };
  checker['market_Check'] = async (statusData: any) => {
    if (!checker.checkBody(statusData)) {
      return 'stateless data';
    }
    const body = checker.getBodyData(statusData);
    console.log(body);

    const orderbook = _.get(body, 'orderbook', {});
    const symbolList = _.get(body, 'symbol_list', []);
    // symbolList.push('XRP/USDT');
    let symbolCheckMessage = '';
    symbolList.forEach((symbol) => {
      const symbolOrderbook = orderbook[symbol];
      if (symbolOrderbook) {
        const updateTime = _.get(symbolOrderbook, 'incomingTimestamp');
        if (new Date().getTime() - updateTime > 1000 * 60 * 3) {
          symbolCheckMessage = `market data expired ${symbol}`;
        }
        return;
      } else {
        symbolCheckMessage = `missing symbol ${symbol}`;
      }
    });
    if (symbolCheckMessage != '') {
      return symbolCheckMessage;
    }

    return true;
  };
  export default defineComponent({
    components: {
      Icon,
      PageWrapper,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col,
      Info,
    },
    setup() {
      const choosed = ref(undefined);
      const pageList = ref([]);
      const [register, { openDrawer: openInfo }] = useDrawer();
      const showInfo = (data) => {
        choosed.value = data;
        openInfo(true);
      };

      let fetchList = async () => {
        let resp: ListModel = await staustList();
        console.log('resp:');
        console.log(resp);

        let newList = [];
        resp.forEach(async (element) => {
          console.log(element);
          let iconName = 'iconoir:pc-warning';
          let errorMessage = '';
          // 'iconoir:pc-check'
          const checked = await checker[`${element.installType}_Check`](element);
          if (checked == true) {
            iconName = 'iconoir:pc-check';
            errorMessage = checked;
          }
          let choosedDetails =
            element.statusBody == '' ? undefined : JSON.parse(element.statusBody);

          newList.push({
            title: `${element.name.toUpperCase()}`,
            type:
              element.installType == 'ammClient'
                ? 'Chain Client'
                : element.installType == 'amm'
                  ? 'AMM Program'
                  : 'Index Program',
            icon: iconName,
            color: '#1890ff',
            choosedDetails: choosedDetails,
            details: element.statusBody,
          });
        });

        pageList.value = newList;
      };
      fetchList();

      return {
        prefixCls: 'list-card',
        pageList,
        register,
        showInfo,
        choosed,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-card {
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
      margin-bottom: -8px;

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
      }
    }
  }
</style>
