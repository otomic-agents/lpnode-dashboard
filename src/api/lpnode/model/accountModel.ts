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

export interface AuthenticationLimiter {
    country_white_list: string;
    country_black_list: string;
    min_age: string;
    account_black_list: string;
    state: string;
}

export interface AuthenticationLimiterParams {
    // authenticationLimiter: AuthenticationLimiter
    authenticationLimiter: string
}

export interface AuthenticationLimiterModel {

}

export interface GetAuthenticationLimiterParams {

}

// export interface GetAuthenticationLimiterModel {
//     data: AuthenticationLimiter;
//     code: number;
//     message: string;
// }

export type GetAuthenticationLimiterModel = string

export interface UpdateLpWalletParams {

}

export type UpdateLpWalletModel = string