<template>
    <PageWrapper :class="prefixCls" title="Transaction List">
        <div :class="`${prefixCls}__content`">
            <!-- Transaction List -->
            <a-list :pagination="pagination" :data-source="transactions" :loading="loading">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-card :hoverable="true" :class="`${prefixCls}__card`">
                            <div :class="`${prefixCls}__card-title`">
                                <div class="tx-info">
                                    <div class="business-id">
                                        <span class="label">Business ID:</span>
                                        <span class="value">{{ item.businessId }}</span>
                                    </div>
                                    <div class="tx-id">
                                        <span class="label">Transaction ID:</span>
                                        <span class="value">{{ item.id }}</span>
                                    </div>

                                    <div class="token-pair">
                                        <span>{{ item.srcTokenName }}</span>
                                        <Icon icon="material-symbols:arrow-right-alt" />
                                        <span>{{ item.dstTokenName }}</span>
                                        <span class="chain-direction">
                                            ({{ item.srcChainName || 'Unknown' }} → {{ item.dstChainName || 'Unknown'
                                            }})
                                        </span>
                                    </div>
                                </div>
                                <div class="tx-status">
                                    <span :class="getStatusClass(item.status)">{{ item.status }}</span>
                                    <div class="chain-info">Chain ID: {{ item.systemChainId }}</div>
                                </div>
                            </div>

                            <div :class="`${prefixCls}__card-detail`">
                                <a-row :gutter="24">
                                    <a-col :span="24">
                                        <div class="detail-item">
                                            <span class="label">Event Name:</span>
                                            <span class="value">{{ item.eventName }}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="label">Gas Price:</span>
                                            <span class="value">{{ formatGasPrice(item.gasPrice, item.systemChainId)
                                                }}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="label">Last Send Time:</span>
                                            <span class="value">{{ formatTimestamp(item.lastSend) }}</span>
                                        </div>

                                        <!-- Send List Section -->
                                        <div class="list-section">
                                            <div class="section-title">Send Records</div>
                                            <div class="table-container">
                                                <template v-if="item.sendList && item.sendList.length">
                                                    <a-table :dataSource="item.sendList" :columns="sendColumns"
                                                        :pagination="false" size="small" :scroll="{ x: 800 }">
                                                        <template #bodyCell="{ column, record }">
                                                            <!-- Custom render for status column -->
                                                            <template v-if="column.dataIndex === 'gasPrice'">
                                                                {{ formatGasPrice(record.gasPrice, item.systemChainId)
                                                                }}
                                                            </template>
                                                            <template v-if="column.dataIndex === 'status'">
                                                                <span :class="getStatusClass(record.status)">{{
                                                                    record.status }}</span>
                                                            </template>
                                                            <!-- Custom render for transaction hash column -->
                                                            <template v-if="column.dataIndex === 'transactionHash'">
                                                                <a :href="getExplorerUrl(item.chainId, record.transactionHash)"
                                                                    target="_blank" class="hash-link">
                                                                    <span class="hash-text">{{
                                                                        formatTxHash(record.transactionHash) }}</span>
                                                                    <Icon icon="material-symbols:open-in-new"
                                                                        class="external-link-icon" />
                                                                </a>
                                                            </template>
                                                            <!-- Custom render for timestamp column -->
                                                            <template v-if="column.dataIndex === 'timestamp'">
                                                                {{ formatTimestamp(record.timestamp) }}
                                                            </template>
                                                            <!-- Custom render for error message column -->
                                                            <template
                                                                v-if="column.dataIndex === 'error' && record.error">
                                                                <span class="error-text">{{ record.error }}</span>
                                                            </template>
                                                        </template>
                                                    </a-table>
                                                </template>
                                                <div v-else class="empty-list">No send records available</div>
                                            </div>
                                        </div>

                                        <!-- Gas List Section -->
                                        <div class="list-section">
                                            <div class="section-title">Gas Records</div>
                                            <div class="table-container">
                                                <template v-if="item.gasList && item.gasList.length">
                                                    <a-table :dataSource="item.gasList" :columns="gasColumns"
                                                        :pagination="false" size="small" :scroll="{ x: 600 }">
                                                        <template #bodyCell="{ column, record }">
                                                            <!-- Custom render for transaction hash column -->
                                                            <template v-if="column.dataIndex === 'transactionHash'">
                                                                <a :href="getExplorerUrl(item.chainId, record.transactionHash)"
                                                                    target="_blank" class="hash-link">
                                                                    <span class="hash-text">{{
                                                                        formatTxHash(record.transactionHash) }}</span>
                                                                    <Icon icon="material-symbols:open-in-new"
                                                                        class="external-link-icon" />
                                                                </a>
                                                            </template>
                                                            <template v-if="column.dataIndex === 'gasPrice'">
                                                                {{ formatGasPrice(record.gasPrice, item.systemChainId)
                                                                }}
                                                            </template>
                                                            <!-- Custom render for timestamp column -->
                                                            <template v-if="column.dataIndex === 'timestamp'">
                                                                {{ formatTimestamp(record.timestamp) }}
                                                            </template>
                                                        </template>
                                                    </a-table>
                                                </template>
                                                <div v-else class="empty-list">No gas records available</div>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-card>
                    </a-list-item>
                </template>
            </a-list>
        </div>
    </PageWrapper>
</template>

<script lang="ts">
import { Row, Col, Card, List, Table } from 'ant-design-vue';
import { defineComponent, ref, reactive, onMounted } from 'vue';
import Icon from '/@/components/Icon/index';
import { PageWrapper } from '/@/components/Page';
import { transactionListLoader } from '../../../api/lpnode/chainclienttransaction';
import * as _ from "lodash";

export default defineComponent({
    components: {
        Icon,
        PageWrapper,
        ACard: Card,
        AList: List,
        AListItem: List.Item,
        ARow: Row,
        ACol: Col,
        ATable: Table,
    },
    setup() {
        const formatGasPrice = (gasPrice: string, chainId: string) => {
            if (!gasPrice || !gasPrice.startsWith('0x')) {
                return gasPrice; // If not in hexadecimal format, return the original value
            }

            try {
                // Convert hexadecimal to decimal
                const decimalValue = BigInt(gasPrice);

                // Determine display format based on chain ID
                if (chainId === '501') {
                    // Solana uses lamports (1 SOL = 10^9 lamports)
                    // Display lamports value directly
                    const lamports = Number(decimalValue);
                    return `${gasPrice} (${lamports.toLocaleString()} lamports)`;
                } else {
                    // Ethereum-based chains (1 ETH = 10^18 wei = 10^9 gwei)
                    // Convert wei to gwei
                    const gweiValue = Number(decimalValue) / 1e9;

                    // Format output with appropriate decimal places
                    let formattedGwei: string;
                    if (gweiValue < 0.01) {
                        formattedGwei = gweiValue.toFixed(6);
                    } else if (gweiValue < 1) {
                        formattedGwei = gweiValue.toFixed(4);
                    } else {
                        formattedGwei = gweiValue.toFixed(2);
                    }

                    return `${gasPrice} (${formattedGwei} Gwei)`;
                }
            } catch (error) {
                console.error('Error formatting gas price:', error);
                return gasPrice; // Return original value on error
            }
        };
        const prefixCls = 'transaction-list';
        const transactions = ref<any[]>([]);
        const loading = ref(false);

        // Define Send Records table columns
        const sendColumns = [
            {
                title: 'Time',
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: 180,
            },
            {
                title: 'Tx Hash',
                dataIndex: 'txHash',
                key: 'txHash',
                width: 150,
                ellipsis: true,  // 添加这个属性
            },
            {
                title: 'Gas Price',
                dataIndex: 'gasPrice',
                key: 'gasPrice',
                width: 300

            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 100,
            },
            {
                title: 'Error',
                dataIndex: 'error',
                key: 'error',
                ellipsis: true,
            },
        ];

        // Define Gas Records table columns
        const gasColumns = [
            {
                title: 'Time',
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: 180,
            },
            {
                title: 'Gas Price',
                dataIndex: 'gasPrice',
                key: 'gasPrice',
                width: 120,
            },
        ];

        const pagination = reactive({
            show: true,
            total: 0,
            current: 1,
            pageSize: 5,
            onChange: (page: number, pageSize: number) => {
                pagination.current = page;
                pagination.pageSize = pageSize;
                fetchTransactions();
            },
        });

        const formatTxHash = (hash: string) => {
            if (!hash) return '';
            return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
        };

        const formatTimestamp = (timestamp: number) => {
            if (!timestamp) return 'N/A';
            return new Date(timestamp).toLocaleString();
        };

        const getStatusClass = (status: string) => {
            if (!status) return '';
            status = status.toLowerCase();
            if (status === 'success' || status === 'confirmed') return 'status-success';
            if (status === 'pending' || status === 'processing') return 'status-pending';
            if (status === 'failed' || status === 'error') return 'status-failed';
            return '';
        };

        const getExplorerUrl = (chainId: number, txHash: string) => {
            if (!txHash) return '#';

            const explorers: Record<number, string> = {
                1: 'https://etherscan.io/tx/',
                56: 'https://bscscan.com/tx/',
                137: 'https://polygonscan.com/tx/',
            };

            const baseUrl = explorers[chainId] || 'https://etherscan.io/tx/';
            return `${baseUrl}${txHash}`;
        };

        const fetchTransactions = async () => {
            loading.value = true;
            try {
                const transactionListResult = await transactionListLoader({
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                });

                console.log("Transaction list result:", transactionListResult);
                if (transactionListResult.list.length > 0) {
                    // Transform API response data format, adding required fields for the component
                    transactions.value = transactionListResult.list.map(item => ({
                        id: item.businessId, // Using businessId as id
                        businessId: item.businessId,
                        status: _.get(item, "status", "-"), // Default status
                        chainId: '-', // Default value
                        srcTokenName: _.get(item, "srcTokenName", "-"),
                        dstTokenName: _.get(item, "dstTokenName", "-"),
                        srcChainName: _.get(item, "srcChainName", "Unknown"), // Source chain name
                        dstChainName: _.get(item, "dstChainName", "Unknown"), // Destination chain name
                        eventName: _.get(item, "eventName", "-"),
                        systemChainId: _.get(item, "systemChainId", "-"),
                        gasPrice: _.get(item, "gasPrice", "-"),
                        lastSend: _.get(item, "lastSend", "-"),
                        sendList: _.get(item, "sendList", []),
                        gasList: _.get(item, "gasList", [])
                    }));
                    pagination.total = transactionListResult.pageCount * pagination.pageSize;
                } else {
                    console.error('API returned empty transaction list');
                    transactions.value = [];
                }
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                transactions.value = [];
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            fetchTransactions();
        });

        return {
            prefixCls,
            transactions,
            pagination,
            loading,
            sendColumns,
            gasColumns,
            formatGasPrice,
            formatTxHash,
            formatTimestamp,
            getStatusClass,
            getExplorerUrl,
        };
    },
});
</script>

<style lang="less" scoped>
.transaction-list {
    &__content {
        padding: 24px;
        margin-top: 12px;
        background-color: #fff;
    }

    &__card {
        width: 100%;
        margin-bottom: 15px;

        .ant-card-body {
            padding: 16px;
        }

        &-title {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f0f0f0;

            .tx-info {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .tx-id,
                .business-id {
                    .label {
                        color: #666;
                        margin-right: 8px;
                    }

                    .value {
                        color: #1890ff;
                        font-family: monospace;
                    }
                }

                .token-pair {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 4px;
                    font-weight: 500;

                    .chain-direction {
                        color: #666;
                        font-size: 13px;
                        font-weight: normal;
                        margin-left: 4px;
                    }
                }
            }

            .tx-status {
                text-align: right;

                .chain-info {
                    margin-top: 8px;
                    font-size: 12px;
                    color: #666;
                }
            }
        }

        &-detail {
            padding-top: 10px;
            font-size: 14px;

            .detail-item {
                margin-bottom: 12px;
                line-height: 1.6;
                display: flex;
                align-items: flex-start;

                .label {
                    font-weight: 500;
                    color: #666;
                    margin-right: 8px;
                    min-width: 120px;
                }

                .value {
                    color: #333;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                }
            }
        }
    }
}

.list-section {
    margin-top: 20px;
    margin-bottom: 24px;

    .section-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px dashed #f0f0f0;
    }

    .table-container {
        margin-bottom: 16px;

        .ant-table-small {
            font-size: 13px;

            .ant-table-thead>tr>th {
                background-color: #fafafa;
                padding: 8px 12px;
            }

            .ant-table-tbody>tr>td {
                padding: 6px 12px;
            }
        }

        .hash-link {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #1890ff;

            &:hover {
                color: #40a9ff;
            }

            .hash-text {
                font-family: monospace;
            }

            .external-link-icon {
                font-size: 14px;
            }
        }

        .error-text {
            color: #f5222d;
            font-size: 12px;
            background-color: #fff1f0;
            padding: 2px 6px;
            border-radius: 2px;
            display: inline-block;
        }
    }

    .empty-list {
        width: 100%;
        padding: 20px;
        text-align: center;
        color: #999;
        background-color: #fafafa;
        border: 1px dashed #e9e9e9;
        border-radius: 4px;
    }
}

.status-success {
    color: #52c41a;
    font-weight: 500;
}

.status-pending {
    color: #faad14;
    font-weight: 500;
}

.status-failed {
    color: #f5222d;
    font-weight: 500;
}
</style>
