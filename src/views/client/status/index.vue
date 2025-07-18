<template>
  <PageWrapper :class="prefixCls" title="LPNode Chain Client">
    <template #headerContent>
      <div :class="`${prefixCls}__link`">
        <a><Icon icon="bx:bx-paper-plane" color="#1890ff" /><span>install</span></a>
        <a><Icon icon="carbon:warning" color="#1890ff" /><span>refresh status</span></a>
      </div>
    </template>

    <div :class="`${prefixCls}__content`">
      <a-list>
        <a-row :gutter="16">
          <template v-for="item in pageList" :key="item.title">
            <a-col :span="24">
              <a-list-item>
                <a-card :hoverable="true" :class="`${prefixCls}__card`" @click="showInfo(item)">
                  <div :class="`${prefixCls}__card-title`">
                    <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                    {{ item.title }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    {{ item.clientInfo.deployment.rpcUrl }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    {{ item.clientInfo.deployment.image }}
                  </div>
                  <div :class="`${prefixCls}__card-detail rpc-section`" v-if="item.rpc && item.rpc !== ''">
                    <Icon icon="fa-solid:network-wired" class="rpc-icon" /> 
                    <span class="rpc-label">Env RPC:</span> 
                    <a :href="item.rpc" target="_blank" class="rpc-link">{{ item.rpc }}</a>
                  </div>     
                </a-card>
              </a-list-item>
            </a-col>
          </template>
        </a-row>
      </a-list>
    </div>
    <Info @register="register" :data="choosed"/>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { Card, Row, Col, List } from 'ant-design-vue';
  import { list } from '/@/api/lpnode/base';
  import { ListModel } from '/@/api/lpnode/model/baseModel';
  import { useDrawer } from '/@/components/Drawer';
  import Info from './info.vue';

  export default defineComponent({
    components: {
      Icon,
      PageWrapper,
      [String(Card.name)]: Card,
      [String(List.name)]: List,
      [String(List.Item.name)]: List.Item,
      [String(Row.name)]: Row,
      [String(Col.name)]: Col,
      Info
    },
    setup() {

      const choosed = ref(undefined)
      const pageList :any= ref([])
      const [register, { openDrawer: openInfo }] = useDrawer();
      const showInfo = (data) => {
        // clientInfo.value = data
        choosed.value = data
        openInfo(true)
      }

      let fetchList = async () => {
        let resp: ListModel = await list({
          installType: 'ammClient'
        })
        console.log('resp:')
        console.log(resp)

        let newList :any[]= []
        resp.forEach(element => {
          let iconName = element.name == 'bsc' ? 'token-branded:bscpad' :
               element.name == 'avax' ? 'token-branded:avax' :
               element.name == 'xrp' ? 'cryptocurrency:xrp' :
               element.name == 'near' ? 'cryptocurrency:near' :
               element.name == 'eth' ? 'token-branded:eth' :
               element.name == 'op' ? 'token-branded:optimism' :
               element.name == 'solana' ? 'token-branded:solana' : 
               element.name == 'polygon' ? 'token-branded:polygon' : '';
          let clientInfo = JSON.parse(element.installContext)     

          newList.push({
            title: `${element.name.toUpperCase()} Chain Client` ,
            icon: iconName,
            color: '#1890ff',
            rpc: element.rpc,
            clientInfo,
            name: element.name
          })
        });

        pageList.value = newList
      }
      fetchList()

      return {
        prefixCls: 'list-card',
        pageList,
        register,
        showInfo,
        choosed
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
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 8px;
        font-size: 18px;
        font-weight: 600;
        color: @text-color;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 12px;
          font-size: 28px !important;
        }
      }

      &-detail {
        padding-top: 8px;
        padding-left: 30px;
        font-size: 14px;
        color: @text-color-secondary;
        line-height: 1.6;
        
        &.rpc-section {
          display: flex;
          align-items: center;
          margin-top: 4px;
          padding-top: 10px;
          border-top: 1px dashed #e8e8e8;
        }
        
        .rpc-icon {
          color: #1890ff;
          font-size: 16px;
          margin-right: 8px;
        }
        
        .rpc-label {
          color: #1890ff;
          font-weight: 500;
          margin-right: 6px;
        }
        
        .rpc-link {
          color: #1890ff;
          text-decoration: underline;
          word-break: break-all;
          
          &:hover {
            color: #40a9ff;
          }
        }
      }
    }
  }
</style>
