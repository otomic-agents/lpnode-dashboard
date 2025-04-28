<template>
    <PageWrapper title="Hedge Account List">
      <div class="hedge-account-list">
        <a-card>
          <a-table
            :columns="columns"
            :data-source="accountList"
            :loading="loading"
            :pagination="false"
            row-key="id"
          >
            <template #status="{ text }">
              <a-tag :color="getStatusColor(text)">{{ text }}</a-tag>
            </template>
            
            <template #action="{ record }">
              <a-space>
                <a @click="viewWalletInfo(record.id)">View Balance</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="Are you sure to delete this account?"
                  @confirm="handleDelete(record.id)"
                  okText="Yes"
                  cancelText="No"
                >
                  <a class="text-red-500">Delete</a>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </div>
    </PageWrapper>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Card, Table, Button, Tag, Space, Popconfirm, Divider, message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { getHedgeAccounts, deleteHedgeAccount } from '/@/api/lpnode/hedge_account';
  import type { HedgeAccount } from '/@/api/lpnode/model/hedgeAccountModel';
  
  export default defineComponent({
    name: 'HedgeAccountList',
    components: {
      PageWrapper,
      ACard: Card,
      ATable: Table,
      AButton: Button,
      ATag: Tag,
      ASpace: Space,
      APopconfirm: Popconfirm,
      ADivider: Divider,
    },
    setup() {
      const router = useRouter();
      const loading = ref(false);
      const accountList = ref<HedgeAccount[]>([]);
  
      const columns = [
        {
          title: 'Account Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Exchange',
          dataIndex: 'exchange',
          key: 'exchange',
        },
        {
          title: 'API Key',
          dataIndex: 'api_key',
          key: 'api_key',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          slots: { customRender: 'status' },
        },
        {
          title: 'Action',
          key: 'action',
          slots: { customRender: 'action' },
        },
      ];
  
      const getStatusColor = (status: string) => {
        const colors = {
          active: 'green',
          inactive: 'orange',
          invalid_keys: 'red',
        };
        return colors[status] || 'default';
      };
  
      const loadAccounts = async () => {
        loading.value = true;
        try {
          const res = await getHedgeAccounts();
          
          if (res != undefined) {
            accountList.value = res;
          } else {
            message.error('Failed to load accounts');
          }
        } catch (error) {
          console.error('Failed to load accounts:', error);
          message.error('Failed to load accounts');
        } finally {
          loading.value = false;
        }
      };
  
      const goToCreate = () => {
        router.push('/hedge-account/create');
      };
  
      const viewWalletInfo = (id: string) => {
        router.push(`/hedge-account/${id}/wallet`);
      };
  
      const handleDelete = async (id: string) => {
        loading.value = true;
        try {
          await deleteHedgeAccount(id);
          message.success('Account deleted successfully');
          await loadAccounts();
        } catch (error) {
          console.error('Failed to delete account:', error);
          message.error('Failed to delete account');
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(() => {
        loadAccounts();
      });
  
      return {
        loading,
        accountList,
        columns,
        goToCreate,
        viewWalletInfo,
        handleDelete,
        getStatusColor,
      };
    },
  });
  </script>
  
  <style lang="less" scoped>
  .hedge-account-list {
    padding: 16px;
  
    .table-operations {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
  </style>
  