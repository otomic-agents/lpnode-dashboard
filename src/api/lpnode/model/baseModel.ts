
export interface DeploayItem {
    installContext: string;
    installType: string;
    name: string;
    status: number;
    yaml: string;
}

export interface ListParams {
    installType: string;
}

export type ListModel = Array<DeploayItem>
// export interface ListModel {
//     code: number;
//     data: Array<DeploayItem>;
//     message: string;
// }

export interface EnvItem {
    key: string;
    value: string;
}

export interface UpdateParamsData {
    installType: string;
    name: string;
    update: boolean;
    installContext: string;	
}

export interface UpdateParams {
    setupConfig: UpdateParamsData
}

export interface UpdateModel {
    code: number;
    data: number;
    message: string;
    CmdStdout: string;
    CmdStderr: string;
    Template: string;
}

export interface ChainlistParams {

}

export interface ChainInfo {
    id: string;
    chainId: number;
    name: string;
    chainName: string;
    tokenName: string;
}

export type ChainlistModel = Array<ChainInfo>

export interface RestartParams {}

export interface RestartModel {}

export interface StaustListParams {}

export interface Status {
    installType: string,
    statusBody: string,
    name: string,
    errMessage: string
}
// {5 items
//     "installType":"ammClient"
//     "statusKey":"obridge-chain-client-status-report-bsc"
//     "statusBody":""
//     "name":"bsc"
//     "errMessage":"redigo: nil returned"
//     }
export type StaustListModel = Array<Status>