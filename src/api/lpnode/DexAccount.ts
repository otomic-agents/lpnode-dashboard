import { lpHttp } from '/@/utils/http/axios';
import { DexWalletInfo } from './model/DexWalletModel';

enum Api {
    GET_WALLET_INFO = '/lpnode/lpnode_admin_panel/account/dex/walletInfo',
    GET_WALLET_ASSETS = '/lpnode/lpnode_admin_panel/wallet/assets'
}

export interface TokenInfo {
    tokenAddress: string;
    symbol: string;
    formattedBalance: string;
    decimals: number;
    isNative: boolean;
    price: string;
    value: string;
    updatedAt: string;
    balance:string;
}

export interface WalletAsset {
    walletAddress: string;
    walletNames: string[];
    tokens: TokenInfo[];
    totalValue: string;
}

export interface ChainAsset {
    chainId: number;
    chainName: string;
    chainType: string;
    nativeToken: string;
    addressAssets: WalletAsset[];
    totalValue: string;
}

export interface WalletAssetsResponse {
    totalAddresses: number;
    lastUpdated: string;
    totalValue: string;
    chainAssets: ChainAsset[];
}

/**
 * Get wallet information
 * @param id Wallet ID
 * @returns Detailed wallet information
 */
export const getWalletInfo = (id: string) =>
    lpHttp.get<DexWalletInfo>({
        url: Api.GET_WALLET_INFO,
        params: { id }
    });

/**
 * Get the balance of a specific token for a specific wallet address
 * @param walletAddress Wallet address
 * @param tokenAddress Token address
 * @param chainId Optional chain ID, if provided will only search on the specific chain
 * @returns Token balance information, including balance, symbol and decimal places
 */
export const getTokenBalance = async (
    walletAddress: string,
    tokenAddress: string,
    chainId?: number
): Promise<{ balance: string; symbol: string; decimals: number } | null> => {
    try {
        console.log(`getTokenBalance called with: wallet=${walletAddress}, token=${tokenAddress}, chainId=${chainId}`);
        
        const response = await lpHttp.get<WalletAssetsResponse>({
            url: Api.GET_WALLET_ASSETS,
            params: {
                hideZeroBalance: false,
                hideSmallBalance: false
            }
        });

        console.log(`API response received, chainAssets count: ${response?.chainAssets?.length || 0}`);

        if (response && response.chainAssets) {
            // If chainId is provided, only search on the specific chain
            const relevantChains = chainId
                ? response.chainAssets.filter(chain => chain.chainId === chainId)
                : response.chainAssets;
                
            console.log(`Relevant chains: ${relevantChains.map(c => `${c.chainId}(${c.chainName})`).join(', ')}`);

            // Iterate through all relevant chains
            for (const chain of relevantChains) {
                console.log(`Checking chain ${chain.chainId} (${chain.chainName}), wallets count: ${chain.addressAssets.length}`);
                
                // Iterate through all wallets on the chain
                for (const addressAsset of chain.addressAssets) {
                    // Check if this is the wallet address we're looking for
                    if (addressAsset.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
                        console.log(`Found matching wallet: ${addressAsset.walletAddress}, tokens count: ${addressAsset.tokens.length}`);
                        
                        // List all available tokens
                        console.log(`Available tokens in wallet:`, addressAsset.tokens.map(t => ({
                            address: t.tokenAddress,
                            symbol: t.symbol,
                            balance: t.formattedBalance,
                            isNative: t.isNative
                        })));
                        
                        // Find the specific token
                        const token = addressAsset.tokens.find(t =>
                            // Handle special case for native token (address is 0x0...0)
                            (t.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()) ||
                            (tokenAddress.toLowerCase() === '0x0000000000000000000000000000000000000000' && t.isNative)
                        );

                        if (token) {
                            console.log(`Found matching token: ${token.tokenAddress} (${token.symbol}), balance: ${token.formattedBalance}`);
                            return {
                                balance: token.formattedBalance,
                                symbol: token.symbol,
                                decimals: token.decimals
                            };
                        } else {
                            console.log(`No matching token found for address: ${tokenAddress} in wallet: ${walletAddress}`);
                        }
                    }
                }
            }
            
            console.log(`No matching wallet or token found after checking all chains`);
        } else {
            console.log(`No chain assets found in response`);
        }

        return null;
    } catch (error) {
        console.error('Error fetching token balance:', error);
        return null;
    }
};


export const getWalletAssets = (
    hideZeroBalance: boolean = false,
    hideSmallBalance: boolean = false
) => {
    return lpHttp.get<WalletAssetsResponse>({
        url: Api.GET_WALLET_ASSETS,
        params: {
            hideZeroBalance,
            hideSmallBalance
        }
    });
};
