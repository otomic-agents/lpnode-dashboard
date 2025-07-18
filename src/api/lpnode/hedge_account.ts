import { lpHttp } from '/@/utils/http/axios';
import {
    CreateHedgeAccountParams,
    HedgeAccount,
    ApiResponse,
    HedgeTask,
    CreateHedgeTaskParams,
    SaveHedgeDataParams,
    SaveHedgeDataResult

} from './model/hedgeAccountModel';

enum Api {
    CREATE_ACCOUNT = '/lpnode/lpnode_admin_panel/account/cex',
    LIST_ACCOUNTS = '/lpnode/lpnode_admin_panel/account/cex',
    AccountList = '/lpnode/lpnode_admin_panel/account/cex',
    DELETE_ACCOUNT = '/lpnode/lpnode_admin_panel/account/cex/',
    LIST_TASKS = '/lpnode/lpnode_admin_panel/hedge/tasks',
    GET_TASK = '/lpnode/lpnode_admin_panel/hedge/tasks/', 
    CREATE_TASK = '/lpnode/lpnode_admin_panel/hedge/tasks',
    DELETE_TASK = '/lpnode/lpnode_admin_panel/hedge/tasks/',
    CLOSE_TASK = '/lpnode/lpnode_admin_panel/hedge/tasks/close/',
    SAVE_HEDGE_DATA = '/lpnode/lpnode_admin_panel/hedge/tasks/data', 
}

/**
 * Create hedge account
 * @param params Create account parameters
 * @returns Created account information
 */
export const createHedgeAccount = (params: CreateHedgeAccountParams) =>
    lpHttp.post<ApiResponse<HedgeAccount>>({ url: Api.CREATE_ACCOUNT, data: params });

export const getHedgeAccounts = () => {
    return lpHttp.get<HedgeAccount[]>({
        url: Api.AccountList,
    });
};

/**
 * Get hedge account list
 * @returns Account list
 */
export const listHedgeAccounts = () =>
    lpHttp.get<HedgeAccount[]>({ url: Api.LIST_ACCOUNTS });

export const deleteHedgeAccount = (id: string) =>
    lpHttp.delete<void>({ url: `${Api.DELETE_ACCOUNT}${id}` });

export const listHedgeTasks = () =>
    lpHttp.get<HedgeTask[]>({ url: Api.LIST_TASKS });

// Newly added function to delete hedge task
export const deleteHedgeTask = (taskId: string) =>
    lpHttp.delete<{ code: number; message: string }>({ url: `${Api.DELETE_TASK}${taskId}` });

export const createHedgeTask = (params: CreateHedgeTaskParams) =>
    lpHttp.post<HedgeTask>({ url: Api.CREATE_TASK, data: params });

/**
 * Get a single hedge task by ID
 * @param taskId The ID of the task to retrieve
 * @returns The hedge task details
 */
export const getHedgeTask = (taskId: string) =>
    lpHttp.get<HedgeTask>({ url: `${Api.GET_TASK}${taskId}` });

export const saveHedgeData = (params: SaveHedgeDataParams) =>
    lpHttp.post<SaveHedgeDataResult>({ url: Api.SAVE_HEDGE_DATA, data: params });

export const closeHedgeTask = (taskId: string) =>
    lpHttp.post<{ code: number; message: string }>({ url: `${Api.CLOSE_TASK}${taskId}` });