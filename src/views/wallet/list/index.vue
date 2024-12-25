<template>
  <PageWrapper :class="prefixCls" title="Wallets">
    <template #headerContent>
      
      <!-- <div :class="`${prefixCls}__link`">
        <a><Icon icon="bx:bx-paper-plane" color="#1890ff" /><span>start</span></a>
        <a><Icon icon="carbon:warning" color="#1890ff" /><span>info</span></a>
        <a><Icon icon="ion:document-text-outline" color="#1890ff" /><span>doc</span></a>
      </div> -->
    </template>

    <div :class="`${prefixCls}__content`">
      <a-list>
        <a-row :gutter="16">
          <template v-for="item in list" :key="item.title">
            <a-col :span="8">
              <a-list-item>
                <a-card :hoverable="true" :class="`${prefixCls}__card`">
                  <template #extra><a @click="deleteWalletFn(item)">delete</a></template>
                  <div :class="`${prefixCls}__card-title`">
                    <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                    {{ item.title }}

                    
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    {{ item.address }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    Chain: {{ item.chain }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    Sign Endpoint: {{ item.signServiceEndpoint }}
                  </div>
                </a-card>
              </a-list-item>
            </a-col>
          </template>
        </a-row>
      </a-list>
    </div>
    <Loading :loading="isLoading" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { Card, Row, Col, List } from 'ant-design-vue';
  import { list, deleteWallet } from '/@/api/lpnode/wallet';
  import { WalletInfo, DeleteParams } from '/@/api/lpnode/model/walletModel';
  import { getChainName } from '/@/obridge/utils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading/index';
  import { useTabs } from '/@/hooks/web/useTabs';

  export default defineComponent({
    components: {
      Loading,
      Icon,
      PageWrapper,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup() {

      const { createMessage } = useMessage();
      const isLoading = ref(false);
      const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();
      // const loadingProps = computed(() => {
      //   console.log('on loadingProps')
      //   return 
      // });
      // const { getLoading, setLoading } = useLoading(loadingProps);

      const pageList = ref([])

      let fetchList = async () => {
        let resp: Array<WalletInfo> = await list({})
        console.log('resp:')
        console.log(resp)

        let newList = []
        resp.forEach(item => {
          newList.push({
            title: item.walletName,
            icon: 'material-symbols:account-balance-wallet-outline',
            color: '#1890ff',
            active: '100',
            address: item.address,
            signServiceEndpoint:item.signServiceEndpoint,
            chain: getChainName(item.chainId),
            id: item.id
          })
        })
        pageList.value = newList
      }
      fetchList()

      const deleteWalletFn = async (wallet) => {
        // setLoading(true)
        isLoading.value = true
        let params: DeleteParams = {
          id: wallet.id
        }
        let resp = await deleteWallet(params)

        if(resp != undefined) {
          createMessage.success('Delete wallet succeed')
        }
        // setLoading(false)
        isLoading.value = false
        refreshPage()
      }

      return {
        // loading,
        isLoading,
        prefixCls: 'list-card',
        list: pageList,
        deleteWalletFn
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
