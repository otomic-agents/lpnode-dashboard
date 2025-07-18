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
    id?:string;
    _id?: string;
}

export interface DeleteModel {
    code: number;
    data: number;
    message: string;
}

export interface VaultWalletInfo {
    address: string;
    hostType: string;
    id: string;
    name: string;
    secertType: string
}

export interface VaultListParams {

}

export type VaultListModel = Array<VaultWalletInfo>