import { lpHttp } from '/@/utils/http/axios';
import { 
        InstallParams, InstallModel,
        UninstallModel, UninstallParams } from './model/chainclientModel';


enum Api {
    UNINSTALL = '/lpnode/lpnode_admin_panel/ctrl/uninstallLpClient',
    INSTALL = '/lpnode/lpnode_admin_panel/ctrl/installLpClient',
    LIST = '/lpnode/lpnode_admin_panel/ctrl/listInstall',
}

export const installChainClient = (data: InstallParams) => lpHttp.post<InstallModel>({ url: Api.INSTALL, data})

export const uninstallChainClient = (data: UninstallParams) => lpHttp.post<UninstallModel>({ url: Api.UNINSTALL, data});