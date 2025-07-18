<template>
  <PageWrapper :class="prefixCls" title="Bridges">
    <template #headerContent></template>

    <div :class="`${prefixCls}__content`">
      <a-list>
        <a-row :gutter="16">
          <template v-for="item in list" :key="item.title">
            <a-col :span="8">
              <a-list-item>
                <a-card :hoverable="true" :class="`${prefixCls}__card`">
                  <template #extra>
                    <a @click="handleDelete(item)" class="delete-btn">Delete</a>
                  </template>
                  <div :class="`${prefixCls}__card-title`">
                    <Icon class="icon" v-if="item.icon" :icon="item.icon" :color="item.color" />
                    <span>{{ item.title }}</span>
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    <div class="detail-item">
                      <span class="label">Amm:</span>
                      <span class="value">{{ item.amm }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Chain:</span>
                      <div class="chain-info">
                        <div class="chain-pair">
                          <img :src="getChainLogo(item.srcChainRawId)" class="chain-logo" />
                          <span>{{ getChainName(item.srcChainRawId) }}</span>
                          <Icon icon="material-symbols:arrow-right-alt" />
                          <img :src="getChainLogo(item.dstChainRawId)" class="chain-logo" />
                          <span>{{ getChainName(item.dstChainRawId) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="detail-item token-section">
                      <span class="label">Token:</span>
                      <div class="value-container">
                        <div class="token-detail">
                          <div class="token-wrapper">
                            <span class="token" :title="item.srcToken">{{ formatAddress(item.srcToken) }}</span>
                            <a-button class="copy-btn" type="link" @click="copyToClipboard(item.srcToken)">
                              <Icon icon="material-symbols:content-copy-outline" />
                            </a-button>
                          </div>
                          <div class="balance">Balance: {{ item.srcTokenBalanceFormatted }}</div>
                        </div>
                        <div class="token-detail">
                          <div class="token-wrapper">
                            <span class="token" :title="item.dstToken">{{ formatAddress(item.dstToken) }}</span>
                            <a-button class="copy-btn" type="link" @click="copyToClipboard(item.dstToken)">
                              <Icon icon="material-symbols:content-copy-outline" />
                            </a-button>
                          </div>
                          <div class="balance">Balance: {{ item.dstTokenBalanceFormatted }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="detail-item">
                      <span class="label">Receiver:</span>
                      <span class="value" :title="item.receiver">{{ item.receiver }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Sender:</span>
                      <span class="value" :title="item.sender">{{ item.sender }}</span>
                    </div>
                  </div>
                </a-card>
              </a-list-item>
            </a-col>
          </template>
        </a-row>
      </a-list>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
import { Row as RowType, Col as ColType, Card as CardType, List as ListType, Modal, Button as ButtonType } from 'ant-design-vue';
const Row: any = RowType;
const Col: any = ColType;
const Card: any = CardType;
const List: any = ListType;
const Button: any = ButtonType;
import { defineComponent, ref } from 'vue';
import Icon from '/@/components/Icon/index';
import { PageWrapper } from '/@/components/Page';
import { list, deleteBridge } from '/@/api/lpnode/bridge';
import { DeleteParams } from '/@/api/lpnode/model/bridgeModel';
import { useMessage } from '/@/hooks/web/useMessage';
import { ChainLogos, DEFAULT_CHAIN_LOGO } from '/@/assets/chainLogos'; 


const CHAIN_ID_TO_NAME: { [key: number]: string } = {
  9006: 'BSC',
  501: 'Solana',
  60: 'Ethereum',
  614: 'Optimism',
};


const CHAIN_NAME_TO_LOGO: { [key: string]: string } = {
  BSC: ChainLogos.BSC,
  Solana: ChainLogos.Solana,
  Ethereum: ChainLogos.Ethereum,
  Optimism: ChainLogos.Optimism,
};

function formatHexBalance(hexBalance: string, decimals: number): string {
  if (!hexBalance || hexBalance === '0') return '0';
  try {
    const cleanHex = hexBalance.replace('0x', '');
    const decimal = BigInt('0x' + cleanHex).toString();
    const len = decimal.length;
    if (len <= decimals) {
      return '0.' + '0'.repeat(decimals - len) + decimal.slice(0, 4);
    }
    const intPart = decimal.slice(0, len - decimals);
    const decPart = decimal.slice(len - decimals);
    const trimmedDecPart = decPart.replace(/0+$/, '').slice(0, 4);
    return trimmedDecPart ? `${intPart}.${trimmedDecPart}` : intPart;
  } catch (e) {
    console.error('Error formatting balance:', e);
    return '0';
  }
}

export default defineComponent({
  components: {
    Icon,
    PageWrapper,
    [Card.name]: Card,
    [List.name]: List,
    [List.Item.name]: List.Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
  },
  setup() {
    const { createMessage } = useMessage();
    const pageList = ref<any[]>([]);


    const getChainName = (chainId: number): string => {
      return CHAIN_ID_TO_NAME[chainId] || 'Unknown';
    };


    const getChainLogo = (chainId: number): string => {
      const chainName = getChainName(chainId);
      return CHAIN_NAME_TO_LOGO[chainName] || DEFAULT_CHAIN_LOGO;
    };

    const formatAddress = (address: string) => {
      if (!address) return '';
      if (address.length <= 12) return address;
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        createMessage.success('Copied to clipboard');
      } catch (err) {
        createMessage.error('Failed to copy');
      }
    };

    const fetchList = async () => {
      const resp: any = await list({});
      const newList = resp.map((item: any) => ({
        title: item.bridgeName,
        icon: 'material-symbols:account-balance-wallet-outline',
        color: '#1890ff',
        amm: item.ammName,
        srcChainRawId: item.srcChainRawId,
        dstChainRawId: item.dstChainRawId,
        srcToken: item.srcToken,
        dstToken: item.dstToken,
        receiver: item.lpReceiverAddress,
        sender: item.walletName,
        id: item._id,
        srcTokenBalanceFormatted: formatHexBalance(item.srcTokenBalance, item.srcTokenDecimals),
        dstTokenBalanceFormatted: formatHexBalance(item.dstTokenBalance, item.dstTokenDecimals),
      }));
      pageList.value = newList;
    };

    const handleDelete = (bridge: any) => {
      Modal.confirm({
        title: 'Are you sure you want to delete this bridge?',
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          await deleteWalletFn(bridge);
        },
      });
    };

    const deleteWalletFn = async (bridge: any) => {
      const params: DeleteParams = { id: bridge.id };
      const resp = await deleteBridge(params);
      if (resp != undefined) {
        createMessage.success('Delete bridge succeed');
        fetchList();
      }
    };

    fetchList();

    return {
      prefixCls: 'list-card',
      list: pageList,
      handleDelete,
      formatAddress,
      copyToClipboard,
      getChainName,
      getChainLogo,
    };
  },
});
</script>

<style lang="less" scoped>
.list-card {
  &__content {
    padding: 16px;
  }

  &__card {
    width: 100%;
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .ant-card-body {
      padding: 16px;
    }

    &-title {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 18px;
      font-weight: 500;
      color: #1f1f1f;

      .icon {
        margin-right: 8px;
        font-size: 24px !important;
      }
    }

    &-detail {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 12px 8px;

      .detail-item {
        display: contents;

        .label {
          font-weight: 500;
          color: #333;
          font-size: 14px;
          line-height: 32px;
        }

        .value {
          color: #666;
          font-size: 14px;
          line-height: 32px;
          word-break: break-all;
        }

        &.token-section {
          .label {
            align-self: start;
            padding-top: 8px;
          }

          .value-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
        }

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

        .token-detail {
          .token-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .token {
            display: block;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            background: #f5f5f5;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
            color: #333;
            flex: 1;
          }

          .copy-btn {
            padding: 4px 8px;
            height: auto;

            .anticon {
              font-size: 16px;
            }
          }

          .balance {
            color: #1890ff;
            font-weight: 500;
            font-size: 13px;
            padding: 4px 12px;
            margin-top: 4px;
          }
        }
      }
    }
  }

  .delete-btn {
    color: #ff4d4f;
    font-weight: 500;
    transition: all 0.3s;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #fff1f0;
      color: #ff7875;
    }
  }
}


@media screen and (max-width: 1400px) {
  .list-card {
    &__card {
      &-detail {
        grid-template-columns: 70px 1fr;
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .list-card {
    &__card {
      &-detail {
        grid-template-columns: 60px 1fr;
        gap: 8px 6px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .list-card {
    &__card {
      &-detail {
        display: flex;
        flex-direction: column;
        gap: 0;

        .detail-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;

          .label {
            margin-bottom: 4px;
            line-height: 1.5;
          }

          .value {
            line-height: 1.5;
          }

          .token-detail {
            padding: 0;

            .token {
              max-width: 100%;
            }

            .balance {
              padding: 4px 0;
            }
          }
        }
      }
    }
  }
}


[data-theme='dark'] {
  .list-card {
    &__card {
      background: #1f1f1f;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &-title {
        color: #fff;
        border-bottom-color: #303030;
      }

      &-detail {
        .detail-item {
          .label {
            color: #d9d9d9;
          }

          .value {
            color: #999;
          }

          .token-detail {
            .token {
              background: #2f2f2f;
              color: #d9d9d9;

              &:hover {
                background: #1f1f1f;
              }
            }

            .balance {
              color: #40a9ff;
            }
          }
        }
      }
    }

    .delete-btn {
      &:hover {
        background-color: rgba(255, 77, 79, 0.1);
      }
    }
  }
}
</style>
