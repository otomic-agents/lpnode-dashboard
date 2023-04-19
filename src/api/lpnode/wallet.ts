import { lpHttp } from '/@/utils/http/axios';

import {
    ListParams, ListModel,
    CreateParams, CreateModel,
    DeleteParams, DeleteModel,
    VaultListParams, VaultListModel
} from './model/walletModel'

enum Api {
    LIST = '/lpnode/lpnode_admin_panel/dexWallet/list',
    CREATE = '/lpnode/lpnode_admin_panel/dexWallet/create',
    DELETE = '/lpnode/lpnode_admin_panel/dexWallet/delete',
    VAULTLIST = '/lpnode/lpnode_admin_panel/dexWallet/vaultList'
}

export const list = (data: ListParams) => lpHttp.get<ListModel>({ url: Api.LIST, data});
export const createWallet = (data: CreateParams) => lpHttp.post<CreateModel>({ url: Api.CREATE, data});
export const deleteWallet = (data: DeleteParams) => lpHttp.post<DeleteModel>({ url: Api.DELETE, data});
export const vaultList = (data: VaultListParams) => lpHttp.post<VaultListModel>({ url: Api.VAULTLIST, data});
