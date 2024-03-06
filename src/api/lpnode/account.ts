import { lpHttp } from '/@/utils/http/axios';

import {
    ListParams, ListModel,
    RegisterParams, RegisterModel,
    AuthenticationLimiterParams, AuthenticationLimiterModel,
    GetAuthenticationLimiterParams, GetAuthenticationLimiterModel,
    UpdateLpWalletParams, UpdateLpWalletModel
} from './model/accountModel'

enum Api {
    LIST = '/lpnode/lpnode_admin_panel/relayAccount/list',
    REGISTER = '/lpnode/lpnode_admin_panel/relayAccount/register',
    SETAUTHENTICATIONLIMITER = '/lpnode/lpnode_admin_panel/authenticationLimiter/setAuthenticationLimiter',
    GETAUTHENTICATIONLIMITER = '/lpnode/lpnode_admin_panel/authenticationLimiter/getAuthenticationLimiter',
    UPDATELPWALLET = '/lpnode/lpnode_admin_panel/dexWallet/updateLpWallet'
}

export const list = (data: ListParams) => lpHttp.get<ListModel>({ url: Api.LIST, data});
export const register = (data: RegisterParams) => lpHttp.post<RegisterModel>({ url: Api.REGISTER, data});
export const setAuthenticationLimiter = (data: AuthenticationLimiterParams) => lpHttp.post<AuthenticationLimiterModel>({ url: Api.SETAUTHENTICATIONLIMITER, data })
export const getAuthenticationLimiter = (data: GetAuthenticationLimiterParams) => lpHttp.post<GetAuthenticationLimiterModel>({ url: Api.GETAUTHENTICATIONLIMITER, data })
export const updateLpWallet = (data: UpdateLpWalletParams) => lpHttp.post<UpdateLpWalletModel>({url: Api.UPDATELPWALLET, data})