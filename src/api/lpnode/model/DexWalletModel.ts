export interface DexWalletInfo {
    _id: string;
    walletName: string;
    privateKey: string;
    address: string;
    addressLower: string;
    chainType: string;
    chainId: number;
    accountId: string;
    storeId: string;
    walletType: string;
    vaultHostType: string;
    vaultName: string;
    vaultSecertType: string;
    signServiceEndpoint: string;
  }