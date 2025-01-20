export interface ListParams {

}

export interface BridgeInfo {
    bridgeName: string;
    srcChainId: string;
    dstChainId: string;
    srcTokenId: string;
    dstTokenId: string;
    walletId: string;
    srcWalletId: string;
    receiveAddress: string;
    ammName: string;
}

export interface ListModel {
    code: number;
    data: Array<BridgeInfo>;
    message: string;
}

export type CreateParams = BridgeInfo

export interface CreateModel {
    code: number;
    data: number;
    message: string;
}

export interface DeleteParams {
    _id?: string;
    id?:string;
}

export interface DeleteModel {
    code: number;
    data: number;
    message: string;
}

export interface RestartParams {

}

export interface RestartModel {
    
}