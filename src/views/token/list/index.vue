<template>
  <PageWrapper :class="prefixCls" title="Search Token">
    <template #headerContent>
      <BasicForm
        :class="`${prefixCls}__header-form`"
        :labelWidth="100"
        :schemas="schemas"
        :showActionButtonGroup="false"
      />
    </template>

    <div :class="`${prefixCls}__container`">
      <a-list>
        <template v-for="item in list" :key="item.id">
          <a-list-item>
            <a-card :class="`${prefixCls}__card`" :bordered="false" :hoverable="true">
              <div :class="`${prefixCls}__card-header`">
                <h3 :class="`${prefixCls}__title`">
                  <Icon :icon="getCoinIcon(item.title)" :class="`${prefixCls}__title-icon`" />
                  {{ item.title }}
                </h3>
                <div :class="`${prefixCls}__tags`">
                  <template v-for="(tag, index) in item.description" :key="index">
                    <Tag :class="`${prefixCls}__tag`" :color="getTagColor(tag)">
                      {{ tag }}
                    </Tag>
                  </template>
                </div>
              </div>
              
              <div :class="`${prefixCls}__address`">
                <Tooltip :title="item.content">
                  <div :class="`${prefixCls}__address-text`">
                    <Icon icon="carbon:data" :class="`${prefixCls}__address-icon`" />
                    {{ item.content }}
                  </div>
                </Tooltip>
                <a-button 
                  type="text" 
                  :class="`${prefixCls}__copy-btn`" 
                  @click="copyToClipboard(item.content)"
                >
                  <Icon icon="material-symbols:content-copy-outline" />
                </a-button>
              </div>
              
              <div :class="`${prefixCls}__action`">
                <template v-for="(action, index) in item.actions" :key="index">
                  <a-button 
                    :type="action.text === 'delete' ? 'danger' : 'primary'"
                    :ghost="action.text !== 'delete'"
                    :class="`${prefixCls}__action-btn`"
                    @click="action.fn(item)"
                  >
                    <Icon
                      :icon="action.icon"
                      :class="`${prefixCls}__action-icon`"
                    />
                    {{ action.text.charAt(0).toUpperCase() + action.text.slice(1) }}
                  </a-button>
                </template>
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
      <a-empty v-if="list.length === 0" :class="`${prefixCls}__empty`" description="No tokens found" />
    </div>
    <Loading :loading="isLoading" />
  </PageWrapper>
</template>
<script lang="ts">
  import { Tag, Tooltip, Card, Button, Empty } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { BasicForm } from '/@/components/Form/index';
  import { actions, schemas } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { List } from 'ant-design-vue';
  import { list } from '/@/api/lpnode/token';
  import { deleteToken } from '/@/api/lpnode/token';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getChainName } from '/@/obridge/utils';
  import { Loading } from '/@/components/Loading/index';
  import { useTabs } from '/@/hooks/web/useTabs';

  export default defineComponent({
    components: {
      Loading,
      Icon,
      Tag,
      Tooltip,
      BasicForm,
      PageWrapper,
      ACard: Card,
      AButton: Button,
      AEmpty: Empty,
      [String(List.name)]: List,
      [String(List.Item.name)]: List.Item,
    },
    setup() {
      const { createMessage } = useMessage();
      const searchList: any = ref([]);
      const isLoading = ref(false);
      const { refreshPage } = useTabs();

      const deleteFn = async (item) => {
        isLoading.value = true;
        console.log('deleteFn:', item);

        let params: any = {
          _id: item.id
        };

        try {
          let resp = await deleteToken(params);
          if(resp != undefined) {
            createMessage.success('Token deleted successfully');
          }
        } catch (error) {
          createMessage.error('Failed to delete token');
        } finally {
          isLoading.value = false;
          refreshPage();
        }
      };

      const isTestToken = (chainId: number, address: string) => {
        if (chainId == 60) {
          if (
            address == '0xFC0894Eb1ea1876ddC183578F37AFe64bFFAdBd0' || 
            address == '0x30DfEC4d5Cd6f819492A04c34E20f5F15171e934' || 
            address == '0x1016A0886b4AeD69043367d501a99cfBAaB052B5'
          ) {
            return true;
          } else {
            return false;
          }
        }

        if (chainId == 966) {
          if (
            address == '0x25B28e17e75F44fF2275F2ba8923ce69CECa73D8' ||
            address == '0x7e36F06Ee6D27b123e8A1fDCBa27F04b56eFb1d5' ||
            address == '0xD511B82FC31eCcDeFBe558552d9fe8b7a4e932b6'
          ) {
            return true;
          } else {
            return false;
          }
        }

        if (chainId == 9000) {
          if (
            address == '0x43e2F9124Ec363A71193bD4fFB1ae6D608185147' ||
            address == '0x0A327833232Ec4c88DbFa0ae6E44b31D6956088e' ||
            address == '0xB526be0B8AeD308892160914B0F25f60Ad3678D7'
          ) {
            return true;
          } else {
            return false;
          }
        }

        return false;
      };

      const faucetFn = async (item) => {
        createMessage.info('Faucet functionality coming soon');
      };

      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          createMessage.success('Address copied to clipboard');
        }).catch(() => {
          createMessage.error('Failed to copy address');
        });
      };

      const getCoinIcon = (tokenName) => {
        const tokenIcons = {
          'USDT': 'cryptocurrency:usdt',
          'USDC': 'cryptocurrency:usdc',
          'BNB': 'cryptocurrency:bnb',
          'ETH': 'cryptocurrency:eth',
          'BTC': 'cryptocurrency:btc',
          'SOL': 'cryptocurrency:sol',
        };
        
        return tokenIcons[tokenName] || 'material-symbols:token';
      };
      
      const getTagColor = (tag) => {
        if (tag.includes('Chain:')) return 'blue';
        if (tag.includes('Market:')) return 'purple';
        if (tag.includes('Type:')) return 'cyan';
        if (tag.includes('Coin:')) return 'gold';
        if (tag.includes('Precision:')) return 'green';
        if (tag.includes('ID:')) return 'geekblue';
        return 'default';
      };

      const fetch = async () => {
        try {
          isLoading.value = true;
          let resp:any = await list({});
          console.log('resp:', resp);
          let newList :any[]= [];
          let tokens = resp.result || resp;
          
          tokens.forEach(item => {
            const itemData = {
              id: item._id,
              title: item.tokenName,
              description: [
                `ID: ${item.chainId}`, 
                `Chain: ${getChainName(item.chainId)}`, 
                `Market: ${item.marketName}`,
                `Type: ${item.chainType}`,
                `Coin: ${item.coinType}`,
                `Precision: ${item.precision}`
              ],
              content: item.address,
              actions: [
                {
                  icon: 'material-symbols:delete-forever',
                  text: 'delete',
                  color: '#ff4d4f',
                  fn: deleteFn
                }
              ]
            };

            if (isTestToken(item.chainId, item.address)) {
              itemData.actions.push({
                icon: 'material-symbols:faucet',
                text: 'faucet',
                color: '#1890ff',
                fn: faucetFn
              });
            }

            newList.push(itemData);
          });

          searchList.value = newList;
        } catch (error) {
          console.error('Error fetching token list:', error);
          createMessage.error('Failed to fetch token list');
        } finally {
          isLoading.value = false;
        }
      };
      
      fetch();

      return {
        isLoading,
        prefixCls: 'list-search',
        list: searchList,
        actions,
        schemas,
        copyToClipboard,
        getCoinIcon,
        getTagColor
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-search {
    &__header {
      &-form {
        margin-bottom: 16px;
      }
    }

    &__container {
      padding: 16px;
      background-color: @component-background;
      border-radius: 4px;
    }

    &__card {
      width: 100%;
      transition: all 0.3s ease;
      margin-bottom: 8px;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      &-header {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
      }
    }

    &__title {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-size: 20px;
      font-weight: 600;
      color: @text-color;
      
      &-icon {
        margin-right: 8px;
        font-size: 24px;
        color: #1890ff;
      }
    }
    
    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    &__tag {
      margin-right: 0;
      font-size: 12px;
    }

    &__address {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f5f5f5;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      
      &-text {
        display: flex;
        align-items: center;
        font-family: 'Courier New', monospace;
        color: @text-color-secondary;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 90%;
      }
      
      &-icon {
        margin-right: 8px;
        color: #1890ff;
      }
    }
    
    &__copy-btn {
      padding: 0 8px;
      
      &:hover {
        color: #1890ff;
      }
    }

    &__action {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      
      &-btn {
        display: flex;
        align-items: center;
      }
      
      &-icon {
        margin-right: 4px;
      }
    }
    
    &__empty {
      margin: 32px 0;
    }
  }
</style>
