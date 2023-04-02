import { lpHttp } from '/@/utils/http/axios';

import {
    // ListParams, ListModel,
    BusinessHistoryParams, BusinessHistoryModel,
    AmmHistoryParams, AmmHistoryModel
} from './model/businessModel'

enum Api {
    BUSINESSHISTORY = '/lpnode/lpnode_admin_panel/orderCenter/list',
    AMMHISTORY = '/lpnode/lpnode_admin_panel/ammOrderCenter/list',
}

export const businessHistory = (data: BusinessHistoryParams) => lpHttp.post<BusinessHistoryModel>({ url: Api.BUSINESSHISTORY, data});
export const ammHistory = (data: AmmHistoryParams) => lpHttp.post<AmmHistoryModel>({ url: Api.AMMHISTORY, data});
