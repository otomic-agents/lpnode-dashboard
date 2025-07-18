/**
 * Send record model
 */
export interface SendRecord {
    timestamp?: number;
    gasPrice?: string;
    transactionHash?: string;
    status?: string;
    error?: string;
    retryCount?: number;
  }
  
  /**
   * Gas record model
   */
  export interface GasRecord {
    timestamp?: number;
    transactionHash?: string;
    gasPrice?: string;
  }
  
  /**
   * Transaction item model
   */
  export interface TransactionItem {
    id?: string;
    systemChainId?: number;
    chainId?: number;
    eventName?: string;
    lastSend?: number;
    gasPrice?: string;
    businessId?: string;
    createdAt?: number;
    updatedAt?: number;
    status?: string;
    srcTokenName?: string;
    dstTokenName?: string;
    sendList?: SendRecord[];
    gasList?: GasRecord[];
  }
  
  /**
   * List transaction parameters
   */
  export interface ListTransactionParams {
    page?: number;
    pageSize?: number;
    businessId?: string;
    status?: string;
    chainId?: number;
    startTime?: number;
    endTime?: number;
  }
  
  /**
   * Transaction list result
   */
  export interface TransactionListResult {
    code: number;
    message: string;
    total: number;
    page: number;
    pageCount: number;
    list: TransactionItem[];
  }