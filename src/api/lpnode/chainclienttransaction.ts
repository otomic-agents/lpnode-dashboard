import { lpHttp } from '/@/utils/http/axios';  // 使用lpHttp
import { 
  TransactionItem, 
  SendRecord, 
  GasRecord, 
  ListTransactionParams, 
  TransactionListResult 
} from './model/transactionModel';

enum Api {
  TRANSACTION_LIST = '/lpnode/lpnode_admin_panel/chain-client-transaction/list',
}

/**
 * Get transaction list
 * @param params List transaction parameters
 * @returns Transaction list result
 */
export const transactionListLoader = (params: ListTransactionParams) => lpHttp.post<TransactionListResult>({ url: Api.TRANSACTION_LIST, data: params }); 
