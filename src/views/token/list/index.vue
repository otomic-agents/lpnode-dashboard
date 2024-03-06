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
            <a-list-item-meta>
              <template #description>
                <div :class="`${prefixCls}__content`">
                  {{ item.content }}
                </div>
                <div :class="`${prefixCls}__action`">
                  <template v-for="action in item.actions" :key="action.icon">
                    <div :class="`${prefixCls}__action-item`"  @click="action.fn(item)">
                      <Icon
                        v-if="action.icon"
                        :class="`${prefixCls}__action-icon`"
                        :icon="action.icon"
                        :color="action.color"
                      />
                      {{ action.text }}
                    </div>
                  </template>
                  <span :class="`${prefixCls}__time`">{{ item.time }}</span>
                </div>
              </template>
              <template #title>
                <p :class="`${prefixCls}__title`">
                  {{ item.title }}
                </p>
                <div>
                  <template v-for="tag in item.description" :key="tag">
                    <Tag class="mb-2">
                      {{ tag }}
                    </Tag>
                  </template>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <Loading :loading="isLoading" />
  </PageWrapper>
</template>
<script lang="ts">
  import { Tag } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { BasicForm } from '/@/components/Form/index';
  import { actions, schemas } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { List } from 'ant-design-vue';
  import { list } from '/@/api/lpnode/token';
  import { TokenInfo } from '/@/api/lpnode/model/tokenModel';
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
      BasicForm,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
    },
    setup() {

      const { createMessage } = useMessage();
      const searchList: any = ref([])
      const isLoading = ref(false);
      const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();


      const deleteFn = async (item) => {
        isLoading.value = true
        console.log('deleteFn:')
        console.log(item)

        let params: any = {
          _id: item.id
        }

        let resp = await deleteToken(params)
        if(resp != undefined) {
          createMessage.success('Delete token succeed')
        }

        isLoading.value = false
        refreshPage()
      }

      const isTestToken = (chainId: number, address: string) => {
        if (chainId == 60) {
          if (
            address == '0xFC0894Eb1ea1876ddC183578F37AFe64bFFAdBd0' || 
            address == '0x30DfEC4d5Cd6f819492A04c34E20f5F15171e934' || 
            address == '0x1016A0886b4AeD69043367d501a99cfBAaB052B5'
          ) {
            
            return true
          } else {
            return false
          }
        }

        if (chainId == 966) {
          if (
            address == '0x25B28e17e75F44fF2275F2ba8923ce69CECa73D8' ||
            address == '0x7e36F06Ee6D27b123e8A1fDCBa27F04b56eFb1d5' ||
            address == '0xD511B82FC31eCcDeFBe558552d9fe8b7a4e932b6'
          ) {
            return true
          } else {
            return false
          }
        }

        if (chainId == 9000) {
          if (
            address == '0x43e2F9124Ec363A71193bD4fFB1ae6D608185147' ||
            address == '0x0A327833232Ec4c88DbFa0ae6E44b31D6956088e' ||
            address == '0xB526be0B8AeD308892160914B0F25f60Ad3678D7'
          ) {
            return true
          } else {
            return false
          }
        }

        return false
      }

      const faucetFn = async (item) => {

      }

      const fetch = async () => {
        let resp: Array<TokenInfo> = await list({})
        console.log('resp:')
        console.log(resp)

        let newList = []
        resp.forEach(item => {
          const itemData = {
            id: item._id,
            title: item.tokenName,
            description: [item.chainId, getChainName(item.chainId), item.marketName],
            content: item.address,
            actions: [
              {
                icon: 'material-symbols:delete-forever',
                text: 'delete',
                color: '#018ffb',
                fn: deleteFn
              }
            ]
          }

          if (isTestToken(item.chainId, item.address)) {
            itemData.actions.push({
              icon: 'material-symbols:faucet',
              text: 'faucet',
              color: '#018ffb',
              fn: faucetFn
            })
          }

          newList.push(itemData)
        })

        searchList.value = newList
      }
      fetch()


      return {
        isLoading,
        prefixCls: 'list-search',
        list: searchList,
        actions,
        schemas,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-search {
    &__header {
      &-form {
        margin-bottom: -16px;
      }
    }

    &__container {
      padding: 12px;
      background-color: @component-background;
    }

    &__title {
      margin-bottom: 12px;
      font-size: 18px;
    }

    &__content {
      color: @text-color-secondary;
    }

    &__action {
      margin-top: 10px;

      &-item {
        display: inline-block;
        padding: 0 16px;
        color: @text-color-secondary;

        &:nth-child(1) {
          padding-left: 0;
        }

        &:nth-child(1),
        &:nth-child(2) {
          border-right: 1px solid @border-color-base;
        }
      }

      &-icon {
        margin-right: 3px;
      }
    }

    &__time {
      position: absolute;
      right: 20px;
      color: rgb(0 0 0 / 45%);
    }
  }
</style>
