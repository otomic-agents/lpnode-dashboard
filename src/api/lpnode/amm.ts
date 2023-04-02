import { lpHttp } from '/@/utils/http/axios';

import { 
    InstallammParams, InstallammModel,
    UninstallammParams, UninstallammModel,
    ListResourceParams, ListResourceModel,
    EditResourceParams, EditResourceModel
} from './model/ammModel';

enum Api {
    UNINSTALLAMM = '/lpnode/lpnode_admin_panel/ctrl/uninstallDeployment',
    INSTALLAMM = '/lpnode/lpnode_admin_panel/ctrl/installDeployment',
    LISTRESOURCE = '/lpnode/lpnode_admin_panel/configResource/list',
    EDITRESOURCE = '/lpnode/lpnode_admin_panel/configResource/edit'
}

export const installAmm = (data: InstallammParams) => lpHttp.post<InstallammModel>({ url: Api.INSTALLAMM, data});

export const uninstallAmm = (data: UninstallammParams) => lpHttp.post<UninstallammModel>({ url: Api.UNINSTALLAMM, data});

export const listResource = (data: ListResourceParams) => lpHttp.post<ListResourceModel>({ url: Api.LISTRESOURCE, data});

export const edit = (data: EditResourceParams) => lpHttp.post<EditResourceModel>({ url: Api.EDITRESOURCE, data});