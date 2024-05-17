import { lpHttp } from '/@/utils/http/axios';
interface UpdateParams {
    relayUri:string;
}
interface UpdateModel {
    code:number;
    msg:string;
}
enum Api {
    UPDATE = '/lpnode/lpnode_admin_panel/settings/save',
}
export const update = (data:  UpdateParams) => lpHttp.post<UpdateModel>({ url: Api.UPDATE, data});