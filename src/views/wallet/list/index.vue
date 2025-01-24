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
                  <template #extra>
                    <a-button type="link" danger @click="deleteWalletFn(item)">delete</a-button>
                  </template>
                  <div :class="`${prefixCls}__card-title`">
                    <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                    {{ item.title }}
                    <a-tag color="blue" class="ml-2">{{ item.chain }}</a-tag>
                  </div>
                  <div :class="`${prefixCls}__card-address`">
                    {{ formatAddress(item.address) }}
                    <a-tooltip :title="item.address">
                      <CopyOutlined class="copy-icon" @click="copyAddress(item.address)" />
                    </a-tooltip>
                  </div>
                  <div :class="`${prefixCls}__card-balance`">
                    Balance: {{ item.balance }} {{ item.chain }}
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
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { Row as RowType, Col as ColType, Card as CardType, Progress as ProgressType, List as ListType } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { list, deleteWallet } from '/@/api/lpnode/wallet';
  import { WalletInfo, DeleteParams } from '/@/api/lpnode/model/walletModel';
  import { getChainName } from '/@/obridge/utils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading } from '/@/components/Loading/index';
  import { useTabs } from '/@/hooks/web/useTabs';
  

  const Progress: any = ProgressType;
  const Row: any = RowType;
  const Col: any = ColType;
  const Card: any = CardType;
  const List: any = ListType;
  export default defineComponent({
    components: {
      Loading,
      Icon,
      PageWrapper,
      CopyOutlined,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup() {
      const formatAddress = (address: string) => {
          return `${address.slice(0, 12)}...${address.slice(-8)}`;
      };

      const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        createMessage.success('copyed');
      };
      const { createMessage } = useMessage()
      const isLoading = ref(false);
      const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();
      // const loadingProps = computed(() => {
      //   console.log('on loadingProps')
      //   return 
      // });
      // const { getLoading, setLoading } = useLoading(loadingProps);

      const pageList:any = ref([])

      let fetchList = async () => {
        let resp: any = await list({})
        console.log('resp:')
        console.log(resp)

        let newList:any[] = []
        resp.forEach(item => {
          newList.push({
              title: item.walletName,
              icon: 'material-symbols:account-balance-wallet-outline', 
              color: '#1890ff',
              active: '100',
              address: item.address,
              signServiceEndpoint: item.signServiceEndpoint,
              chain: getChainName(item.chainId),
              balance: item.balance,
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
        formatAddress,
        copyAddress,
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
    &__card-address {
        padding: 12px 0;
        font-family: monospace;  
        font-size: 14px;       
        letter-spacing: 0.5px; 
        color: @text-color;
        
        .copy-icon {
            margin-left: 12px; 
            cursor: pointer;
            
            &:hover {
                color: @primary-color;
            }
        }
    }

    &__card-balance {
      font-size: 16px;
      font-weight: 500;
      color: @success-color;
      padding: 8px 0;
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
        font-size: 14px;
        color: @text-color-secondary;
      }
    }
  }
</style>
