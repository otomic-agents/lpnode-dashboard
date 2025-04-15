<template>
  <div class="tree-view">
    <div v-for="(value, key) in data" :key="`${panelId}-${key}`" class="tree-node">
      <!-- If it's a leaf node (metric) -->
      <template v-if="isMetric(value)">
        <div class="metric-node">
          <div class="metric-header">
            <span class="metric-name">{{ formatKey(String(key)) }}</span>
            <Tag class="metric-status" :color="getStatusColor(value.status)">
              {{ value.status }}
            </Tag>
          </div>
          <div class="metric-value">
            {{ value.value }}
            <span v-if="value.additionalData" class="metric-threshold">
              ({{ value.additionalData.condition }} {{ value.additionalData.threshold }})
            </span>
          </div>
          <div class="metric-time">
            <Icon icon="material-symbols:update" class="time-icon" />
            {{ formatDate(value.updatedAt) }}
          </div>
        </div>
      </template>
      
      <!-- If it's a branch node -->
      <template v-else>
        <div class="branch-node">
          <div class="branch-header" @click="toggleNode(String(key))">
            <div class="branch-left">
              <span class="branch-icon">
                <Icon :icon="expandedNodes[String(key)] ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
              </span>
              <span class="branch-name">{{ formatKey(String(key)) }}</span>
            </div>
            <Tag class="branch-status" :color="getStatusColor(getBranchStatus(value))">
              {{ getBranchStatus(value) }}
            </Tag>
          </div>
          
          <div v-show="expandedNodes[String(key)]" class="branch-children">
            <TreeView 
              :data="value" 
              :panel-id="`${panelId}-${key}`" 
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue';
import { Tag } from 'ant-design-vue';
import Icon from '/@/components/Icon/index';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'TreeView',
  components: {
    Tag,
    Icon,
  },
  props: {
    data: {
      type: Object as PropType<any>,
      required: true,
    },
    panelId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const expandedNodes = reactive<Record<string, boolean>>({});
    
    // Expand first level nodes by default
    for (const key in props.data) {
      expandedNodes[String(key)] = true;
    }

    const toggleNode = (key: string) => {
      expandedNodes[key] = !expandedNodes[key];
    };

    const isMetric = (value: any): boolean => {
      return value && typeof value === 'object' && 'status' in value && 'value' in value;
    };

    const formatKey = (key: string): string => {
      // No longer splitting underscores and hyphens, keeping the full title
      return key.charAt(0).toUpperCase() + key.slice(1);
    };

    const formatDate = (dateString: string): string => {
      return dateString ? dayjs(dateString).format('YYYY-MM-DD HH:mm:ss') : '';
    };

    const getStatusColor = (status: string): string => {
      if (!status) return 'default';
      const statusColors: Record<string, string> = {
        'normal': '#52c41a',  // Green
        'alert': '#faad14',   // Yellow
        'warning': '#fa8c16', // Orange
        'error': '#f5222d',   // Red
      };
      return statusColors[status.toLowerCase()] || 'default';
    };

    const getBranchStatus = (branch: any): string => {
      let worstStatus = 'normal';
      const statusPriority = {
        'normal': 0,
        'warning': 1,
        'alert': 2,
        'error': 3
      };

      const checkStatus = (obj: any) => {
        for (const key in obj) {
          const value = obj[key];
          if (isMetric(value)) {
            // If current status is worse than the worst status, update worst status
            if (statusPriority[value.status.toLowerCase()] > statusPriority[worstStatus]) {
              worstStatus = value.status.toLowerCase();
            }
          } else if (value && typeof value === 'object') {
            checkStatus(value);
          }
        }
      };

      checkStatus(branch);
      return worstStatus;
    };

    return {
      expandedNodes,
      toggleNode,
      isMetric,
      formatKey,
      formatDate,
      getStatusColor,
      getBranchStatus,
    };
  },
});
</script>

<style scoped>
.tree-view {
  font-family: Arial, sans-serif;
  width: 100%;
}

.tree-node {
  margin-bottom: 8px;
  width: 100%;
}

.metric-node {
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  border-left: 4px solid #1890ff;
  width: 100%;
  box-sizing: border-box;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
}

.metric-name {
  font-weight: 500;
  font-size: 16px;
}

.metric-status {
  margin-left: auto;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.metric-threshold {
  font-size: 14px;
  font-weight: normal;
  color: #666;
  margin-left: 8px;
}

.metric-time {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.time-icon {
  margin-right: 6px;
  color: #1890ff;
}

.branch-node {
  margin-bottom: 12px;
  width: 100%;
}

.branch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.branch-header:hover {
  background-color: #f0f0f0;
}

.branch-left {
  display: flex;
  align-items: center;
}

.branch-icon {
  margin-right: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.branch-name {
  font-weight: 500;
  font-size: 14px;
}

.branch-status {
  margin-left: auto;
}

.branch-children {
  padding-left: 24px;
  margin-top: 8px;
  border-left: 1px dashed #d9d9d9;
  width: 100%;
  box-sizing: border-box;
}
</style>
