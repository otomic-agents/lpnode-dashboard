import { lpHttp } from '/@/utils/http/axios';

import {
    ListModel, ListParams,
    UpdateParams, UpdateModel,
    ChainlistParams, ChainlistModel,
    RestartParams, RestartModel,
    StaustListParams, StaustListModel,
    RelayListParams, RelayListModel
} from './model/baseModel';

enum Api {
    LIST = '/lpnode/lpnode_admin_panel/ctrl/listInstall',
    UPDATE = '/lpnode/lpnode_admin_panel/ctrl/updateDeployment',
    CHAINLIST = '/lpnode/lpnode_admin_panel/baseData/chainDataList',
    RESTART = '/lpnode/lpnode_admin_panel/relayAccount/registerAll',
    STATUSLIST = '/lpnode/lpnode_admin_panel/staustList/list',
    RELAYLIST = '/lpnode/lpnode_admin_panel/relayList/list'
}

export const list = (data: ListParams) => lpHttp.post<ListModel>({ url: Api.LIST, data });

export const update = (data: UpdateParams) => lpHttp.post<UpdateModel>({ url: Api.UPDATE, data });

export const chainList = (data: ChainlistParams) => lpHttp.get<ChainlistModel>({ url: Api.CHAINLIST, data });

export const relayList = (data: RelayListParams) => lpHttp.get<RelayListModel>({ url: Api.RELAYLIST, data });

export const restart = (data: RestartParams) => lpHttp.post<RestartModel>({ url: Api.RESTART, data });

export const staustList = (data: StaustListParams) => lpHttp.post<StaustListModel>({ url: Api.STATUSLIST, data });