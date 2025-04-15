<template>
  <PageWrapper :class="prefixCls" title="Alert History">
    <div :class="`${prefixCls}__container`">
      <!-- Alert history list -->
      <a-list>
        <template v-for="item in alertsList" :key="item._id.$oid">
          <a-list-item :class="`${prefixCls}__list-item`">
            <a-card :class="`${prefixCls}__card`" :bordered="false" :hoverable="true">
              <div :class="`${prefixCls}__card-header`">
                <h3 :class="`${prefixCls}__title`">
                  <Icon icon="material-symbols:notifications-active" :class="`${prefixCls}__title-icon`" />
                  {{ item.ruleName }}
                </h3>
                <div :class="`${prefixCls}__tags`">
                  <Tag :class="`${prefixCls}__tag`" :color="getSeverityColor(item.severity)">
                    {{ item.severity }}
                  </Tag>
                  <Tag :class="`${prefixCls}__tag`" :color="getStatusColor(item.triggered)">
                    {{ item.triggered ? 'Active' : 'Resolved' }}
                  </Tag>
                  <Tag :class="`${prefixCls}__tag`" color="blue">
                    Threshold: {{ item.condition }} {{ item.threshold }}
                  </Tag>
                  <Tag :class="`${prefixCls}__tag`" :color="item.isErrorAlert ? 'red' : 'default'">
                    {{ item.isErrorAlert ? 'Error Alert' : 'Value Alert' }}
                  </Tag>
                </div>
              </div>

              <div :class="`${prefixCls}__description`">
                {{ item.description }}
              </div>

              <div :class="`${prefixCls}__value-section`">
                <div :class="`${prefixCls}__value-header`">
                  <Icon icon="mdi:chart-line" :class="`${prefixCls}__value-icon`" />
                  Alert Value
                </div>
                <div :class="`${prefixCls}__value-content`">
                  <pre>{{ formatValue(item.value) }}</pre>
                </div>
              </div>

              <div :class="`${prefixCls}__time-info`">
                <div :class="`${prefixCls}__time-item`">
                  <Icon icon="material-symbols:calendar-today" :class="`${prefixCls}__time-icon`" />
                  Created: {{ formatDate(item.createdAt.$date) }}
                </div>
                <div v-if="item.lastNotifiedAt" :class="`${prefixCls}__time-item`">
                  <Icon icon="material-symbols:notifications" :class="`${prefixCls}__time-icon`" />
                  Last Notified: {{ formatDate(item.lastNotifiedAt.$date) }}
                </div>
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
      <a-empty v-if="alertsList.length === 0" :class="`${prefixCls}__empty`" description="No alerts found" />
    </div>
    <Loading :loading="isLoading" />
  </PageWrapper>
</template>

<script lang="ts">
import { Tag, Card, Button, Empty } from 'ant-design-vue';
import { defineComponent, ref, onMounted } from 'vue';
import Icon from '/@/components/Icon/index';
import { PageWrapper } from '/@/components/Page';
import { List } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useRouter } from 'vue-router';
import { Loading } from '/@/components/Loading/index';
import { listAlerts } from '/@/api/lpnode/alert';
import dayjs from 'dayjs';

export default defineComponent({
  components: {
    Loading,
    Icon,
    Tag,
    PageWrapper,
    ACard: Card,
    AButton: Button,
    AEmpty: Empty,
    [String(List.name)]: List,
    [String(List.Item.name)]: List.Item,
  },
  setup() {
    const router = useRouter();
    const { createMessage } = useMessage();
    const alertsList = ref<any[]>([]);
    const isLoading = ref(false);

    const fetchAlerts = async () => {
      try {
        isLoading.value = true;
        // Use the encapsulated API method to get alert list with filter parameters
        const response = await listAlerts();
        if (response) {
          alertsList.value = response;
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
        createMessage.error('Failed to fetch alert history');
      } finally {
        isLoading.value = false;
      }
    };

    const handleViewDetails = (item: any) => {
      createMessage.info(`View alert details: ${item.ruleName}`);
    };

    const handleAcknowledge = async (item: any) => {
      try {
        isLoading.value = true;
        // Simulate alert acknowledgement
        createMessage.success('Alert acknowledged successfully');
        // Update local data
        const index = alertsList.value.findIndex(alert => alert._id.$oid === item._id.$oid);
        if (index !== -1) {
          alertsList.value[index].triggered = false;
        }
      } catch (error) {
        console.error('Error acknowledging alert:', error);
        createMessage.error('Failed to acknowledge alert');
      } finally {
        isLoading.value = false;
      }
    };

    const formatDate = (dateString: string) => {
      return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
    };

    const formatValue = (value: any) => {
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    };

    const getSeverityColor = (severity: string) => {
      const severityColors = {
        'critical': '#f5222d',  // Red
        'error': '#fa541c',     // Orange-red
        'warning': '#faad14',   // Yellow
        'info': '#1890ff'       // Blue
      };
      return severityColors[severity.toLowerCase()] || 'default';
    };

    const getStatusColor = (triggered: boolean) => {
      return triggered ? '#f5222d' : '#52c41a'; // Red for active, green for resolved
    };

    onMounted(() => {
      fetchAlerts();
    });

    return {
      isLoading,
      prefixCls: 'alert-history',
      alertsList,
      handleViewDetails,
      handleAcknowledge,
      formatDate,
      formatValue,
      getSeverityColor,
      getStatusColor
    };
  },
});
</script>

<style lang="less" scoped>
.alert-history {
  &__container {
    padding: 8px;
    background-color: @component-background;
    border-radius: 4px;
  }

  &__list-item {
    padding: 4px 0 !important;
  }

  &__card {
    width: 100%;
    transition: all 0.3s ease;
    margin-bottom: 4px;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &-header {
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 600;
    color: @text-color;

    &-icon {
      margin-right: 6px;
      font-size: 20px;
      color: #1890ff;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }

  &__tag {
    margin-right: 0;
    font-size: 11px;
    padding: 0 6px;
  }

  &__description {
    font-size: 13px;
    color: @text-color-secondary;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  &__value-section {
    background-color: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  &__value-header {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    background-color: #e6f7ff;
    border-bottom: 1px solid #91d5ff;
    font-weight: 500;
    color: #1890ff;
    font-size: 13px;
  }

  &__value-icon {
    margin-right: 6px;
    font-size: 16px;
  }

  &__value-content {
    padding: 8px 12px;

    pre {
      margin: 0;
      font-family: 'Courier New', monospace;
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 12px;
      color: @text-color;
      line-height: 1.3;
    }
  }

  &__time-info {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
    color: @text-color-secondary;
    font-size: 12px;
  }

  &__time-item {
    display: flex;
    align-items: center;
  }

  &__time-icon {
    margin-right: 4px;
    color: #1890ff;
    font-size: 16px;
  }

  &__action {
    display: flex;
    gap: 8px;
    margin-top: 8px;

    &-btn {
      display: flex;
      align-items: center;
    }

    &-icon {
      margin-right: 4px;
    }
  }

  &__empty {
    margin: 16px 0;
  }
}
</style>
