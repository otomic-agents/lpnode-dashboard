import { lpHttp } from '/@/utils/http/axios';

import {
    ListParams, ListModel,
    RegisterParams, RegisterModel
} from './model/accountModel'

enum Api {
    LIST = '/lpnode/lpnode_admin_panel/relayAccount/list',
    REGISTER = '/lpnode/lpnode_admin_panel/relayAccount/register',
}

export const list = (data: ListParams) => lpHttp.get<ListModel>({ url: Api.LIST, data});
export const register = (data: RegisterParams) => lpHttp.post<RegisterModel>({ url: Api.REGISTER, data});