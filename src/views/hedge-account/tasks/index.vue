<template>
  <PageWrapper title="Hedge Tasks">
    <div class="hedge-tasks">
      <a-card>
        <a-table :columns="columns" :data-source="taskList" :loading="loading" :pagination="false" row-key="id">
          <template #status="{ text }">
            <a-tag :color="getStatusColor(text)">{{ text }}</a-tag>
          </template>

          <template #action="{ record }">
            <a-space>
              <a @click="editTask(record.id)">Edit</a>
              <a-divider type="vertical" />
              <a-popconfirm title="Are you sure to close this task?" @confirm="handleClose(record.id)" okText="Yes"
                cancelText="No" v-if="record.status === 'active' || record.status === 'pending'">
                <a class="text-red-500">Close</a>
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
import { Card, Table, Button, Tag, Space, Divider, message, Popconfirm } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { listHedgeTasks, closeHedgeTask } from '/@/api/lpnode/hedge_account';
import { HedgeTask } from "/@/api/lpnode/model/hedgeAccountModel";

export default defineComponent({
  name: 'HedgeTasks',
  components: {
    PageWrapper,
    ACard: Card,
    ATable: Table,
    AButton: Button,
    ATag: Tag,
    ASpace: Space,
    ADivider: Divider,
    APopconfirm: Popconfirm,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const taskList = ref<HedgeTask[]>([]);

    const columns = [
      {
        title: 'Task Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        slots: { customRender: 'status' },
      },
      {
        title: 'Account ID',
        dataIndex: 'account_id',
        key: 'account_id',
        width: '200px',
      },
      {
        title: 'Bridge ID',
        dataIndex: 'bridge_id',
        key: 'bridge_id',
        width: '200px',
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
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
        pending: 'orange',
        completed: 'blue',
        failed: 'red',
        cancelled: 'gray',
      };
      return colors[status] || 'default';
    };

    const fetchTasks = async () => {
      loading.value = true;
      try {
        const res = await listHedgeTasks();
        taskList.value = res;
      } catch (error) {
        console.error('Failed to fetch hedge tasks:', error);
        message.error('Failed to load hedge tasks');
      } finally {
        loading.value = false;
      }
    };

    // Navigate to create page
    const goToCreate = () => {
      router.push('/hedge/tasks_create');
    };

    // Navigate to edit page (using query parameters)
    const editTask = (id: string) => {
      router.push(`/hedge/tasks_create?id=${id}`);
    };

    const handleClose = async (id: string) => {
      try {
        await closeHedgeTask(id);
        message.success('Task closed successfully');
        fetchTasks(); // Reload the list
      } catch (error) {
        console.error('Failed to close task:', error);
        message.error('Failed to close task');
      }
    };

    onMounted(() => {
      fetchTasks();
    });

    return {
      loading,
      taskList,
      columns,
      getStatusColor,
      handleClose,
      goToCreate,
      editTask,
    };
  },
});
</script>

<style lang="less" scoped>
.hedge-tasks {
  padding: 16px;

  .table-operations {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
