export interface ListParams {

}

export interface TokenInfo {
    chainId: number;
    address: string;
    tokenName: string;
    marketName: string;
    precision: number;
    coinType: string;
}

export interface ListModel {
    code: number;
    data: Array<TokenInfo>;
    message: string;
}

export type CreateParams = TokenInfo

export interface CreateModel {
    code: number;
    data: number;
    message: string;
}

export interface DeleteParams {
    _id: string;
}

export interface DeleteModel {
    code: number;
    data: number;
    message: string;
}