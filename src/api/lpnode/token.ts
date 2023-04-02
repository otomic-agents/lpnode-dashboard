import { lpHttp } from '/@/utils/http/axios';

import {
    ListParams, ListModel,
    CreateParams, CreateModel,
    DeleteParams, DeleteModel
} from './model/tokenModel'

enum Api {
    LIST = '/lpnode/lpnode_admin_panel/tokenManager/list',
    CREATE = '/lpnode/lpnode_admin_panel/tokenManager/create',
    DELETE = '/lpnode/lpnode_admin_panel/tokenManager/delete'
}

export const list = (data: ListParams) => lpHttp.get<ListModel>({ url: Api.LIST, data});
export const createToken = (data: CreateParams) => lpHttp.post<CreateModel>({ url: Api.CREATE, data});
export const deleteToken = (data: DeleteParams) => lpHttp.post<DeleteModel>({ url: Api.DELETE, data});
