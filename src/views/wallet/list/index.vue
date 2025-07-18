<template>
  <PageWrapper :class="prefixCls" title="Wallets">
    <template #headerContent>
      <!-- Header content can be added here -->
    </template>

    <div :class="`${prefixCls}__content`">
      <a-list>
        <a-row :gutter="16">
          <template v-for="item in list" :key="item.title">
            <a-col :span="8">
              <a-list-item>
                <a-card :hoverable="true" :class="`${prefixCls}__card`">
                  <template #extra>
                    <a-button type="link" danger @click="showDeleteConfirm(item)">delete</a-button>
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
import { Row as RowType, Col as ColType, Card as CardType, Progress as ProgressType, List as ListType, Modal } from 'ant-design-vue';
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
      createMessage.success('Copied to clipboard');
    };

    const { createMessage, createConfirm } = useMessage();
    const isLoading = ref(false);
    const { refreshPage } = useTabs();
    const pageList: any = ref([]);

    // Fetch wallet list
    const fetchList = async () => {
      let resp: any = await list({});
      console.log('📋 Response:', resp);

      let newList: any[] = [];
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
        });
      });
      pageList.value = newList;
    };

    // Show delete confirmation dialog
    const showDeleteConfirm = (wallet) => {
      createConfirm({
        iconType: 'warning',
        title: 'Delete Wallet',
        content: `Are you sure you want to delete wallet "${wallet.title}"?`,
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => deleteWalletFn(wallet),
      });
    };

    // Delete wallet function
    const deleteWalletFn = async (wallet) => {
      try {
        isLoading.value = true;
        let params: DeleteParams = {
          id: wallet.id
        };
        let resp = await deleteWallet(params);

        if (resp != undefined) {
          createMessage.success('Wallet deleted successfully');
          await fetchList(); // Refresh the list after deletion
        }
      } catch (error) {
        createMessage.error('Failed to delete wallet');
        console.error('🔴 Delete wallet error:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Initial fetch
    fetchList();

    return {
      formatAddress,
      copyAddress,
      isLoading,
      prefixCls: 'list-card',
      list: pageList,
      showDeleteConfirm,
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
