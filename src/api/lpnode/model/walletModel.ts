export interface ListParams {
}

export interface WalletInfo {
    walletName: string;
    privateKey: string;
    address: string;
    chainType: string;
    chainId: string;
}

export interface ListModel {
    code: number;
    data: Array<WalletInfo>;
    message: string;
}

export type CreateParams = WalletInfo

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