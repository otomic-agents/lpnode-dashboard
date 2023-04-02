export interface ListParams {

}

export interface AccountInfo {
    id: string;
    name: string;
    profile: string;
    lpIdFake: string;
    lpNodeApiKey: string;
    relayApiKey: string;
}

export interface ListModel {
    code: number;
    data: Array<AccountInfo>;
    message: string;
}

export interface RegisterParams {
    name: string;
    profile: string;
}

export interface RegisterModel {
    
}