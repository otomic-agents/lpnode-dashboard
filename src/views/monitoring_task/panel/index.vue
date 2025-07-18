<template>
    <PageWrapper :class="prefixCls" title="Monitoring Panel">
        <div :class="`${prefixCls}__container`">
            <!-- Monitoring panels list -->
            <template v-if="Object.keys(panelsData).length > 0">
                <div class="panel-cards">
                    <template v-for="(panelData, panelId) in panelsData" :key="panelId">
                        <a-card :class="`${prefixCls}__card`" :bordered="false" :hoverable="true">
                            <div :class="`${prefixCls}__card-header`">
                                <h3 :class="`${prefixCls}__title`">
                                    <Icon icon="mdi:view-dashboard" :class="`${prefixCls}__title-icon`" />
                                    {{ formatPanelName(panelId) }}
                                </h3>
                                <div :class="`${prefixCls}__tags`">
                                    <Tag :class="`${prefixCls}__tag`"
                                        :color="getStatusColor(getPanelStatus(panelData))">
                                        {{ getPanelStatus(panelData) }}
                                    </Tag>
                                </div>
                            </div>

                            <!-- Mind map visualization -->
                            <div :class="`${prefixCls}__mind-map-container`">
                                <TreeView :data="panelData" :panel-id="panelId" />
                            </div>

                        </a-card>
                    </template>
                </div>
            </template>

            <!-- Empty state -->
            <a-empty v-else :class="`${prefixCls}__empty`" description="No monitoring panels found" />
        </div>
        <Loading :loading="isLoading" />
    </PageWrapper>
</template>


<script lang="ts">
import { Tag, Card, Button, Empty, Tree } from 'ant-design-vue';
import { defineComponent, ref, onMounted, reactive } from 'vue';
import Icon from '/@/components/Icon/index';
import { PageWrapper } from '/@/components/Page';
import { List } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useRouter } from 'vue-router';
import { Loading } from '/@/components/Loading/index';
import { getPanels } from '/@/api/lpnode/panel';
import TreeView from './components/TreeView.vue';

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
        TreeView,
    },
    setup() {
        const router = useRouter();
        const { createMessage } = useMessage();
        const panelsData = ref({});
        const isLoading = ref(false);
        const isDebug = ref(false); // Set to true to show debug info

        const fetchPanels = async () => {
            try {
                isLoading.value = true;
                const response = await getPanels();
                console.log('API Response:', response); // Debug log

                panelsData.value = response;

            } catch (error) {
                console.error('Error fetching panels:', error);
                createMessage.error('Failed to fetch monitoring panels');
            } finally {
                isLoading.value = false;
            }
        };

        const handleViewPanel = (panelId: string) => {
            createMessage.info(`View monitoring panel: ${panelId}`);
        };

        const formatPanelName = (panelId: string) => {
            return panelId
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        const getStatusColor = (status: string) => {
            if (!status) return 'default';
            const statusColors = {
                'normal': '#52c41a',  // Green
                'alert': '#faad14',   // Yellow
                'warning': '#fa8c16', // Orange
                'error': '#f5222d',   // Red
            };
            return statusColors[status.toLowerCase()] || 'default';
        };
        
        // Add missing getPanelStatus function
        const getPanelStatus = (panelData: any): string => {
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
                    if (value && typeof value === 'object' && 'status' in value && 'value' in value) {
                        // If current status is worse than worstStatus, update worstStatus
                        if (statusPriority[value.status.toLowerCase()] > statusPriority[worstStatus]) {
                            worstStatus = value.status.toLowerCase();
                        }
                    } else if (value && typeof value === 'object') {
                        checkStatus(value);
                    }
                }
            };

            checkStatus(panelData);
            return worstStatus;
        };
        
        onMounted(() => {
            fetchPanels();
        });

        return {
            isLoading,
            isDebug,
            prefixCls: 'monitoring-panel',
            panelsData,
            handleViewPanel,
            formatPanelName,
            getPanelStatus,
            getStatusColor,
        };
    },
});
</script>
<style lang="less" scoped>
.monitoring-panel {
    &__container {
        padding: 16px;
        background-color: @component-background;
        border-radius: 4px;
        width: 100%;
    }

    .panel-cards {
        width: 100%;
    }

    &__card {
        width: 100%;
        transition: all 0.3s ease;
        margin-bottom: 16px;

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &-header {
            display: flex;
            flex-direction: column;
            margin-bottom: 16px;
            width: 100%;
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
        margin-bottom: 16px;
    }

    &__tag {
        margin-right: 0;
        font-size: 12px;
    }

    &__mind-map-container {
        width: 100%;
        margin-bottom: 16px;
        /* Remove fixed height to make container height responsive */
        min-height: 100px; /* Optional: Set minimum height to ensure visibility even with little content */
        max-height: none; /* Ensure no maximum height restriction */
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
