import { lpHttp } from '/@/utils/http/axios';

import {
    ListParams, ListModel,
    CreateParams, CreateModel,
    DeleteParams, DeleteModel
} from './model/bridgeModel'

enum Api {
    LIST = '/lpnode/lpnode_admin_panel/bridge/list',
    CREATE = '/lpnode/lpnode_admin_panel/bridge/create',
    DELETE = '/lpnode/lpnode_admin_panel/bridge/delete'
}

export const list = (data: ListParams) => lpHttp.get<ListModel>({ url: Api.LIST, data});
export const createBridge = (data: CreateParams) => lpHttp.post<CreateModel>({ url: Api.CREATE, data});
export const deleteBridge = (data: DeleteParams) => lpHttp.post<DeleteModel>({ url: Api.DELETE, data});