import { lpHttp } from '/@/utils/http/axios';

enum Api {
    GET_CEX_TOKEN_BALANCE = '/lpnode/lpnode_admin_panel/account/cex',
    LIST_CEX_ACCOUNTS = '/lpnode/lpnode_admin_panel/account/cex'
}

export interface CexTokenBalance {
    asset: string;
    free: string;
    locked: string;
    total: string;
    usdValue:string;
}

export interface CexTokensResponse {
    code: number;
    result: CexTokenBalance[];
    message: string;
}

export interface CexAccount {
    id: string;
    name: string;
    exchange: string;
    api_key: string;
    status: string;
}

export interface CexAccountsResponse {
    code: number;
    result: CexAccount[];
    message: string;
}

/**
 * Get the balance of a specific token for a CEX account
 * @param accountId CEX account ID
 * @param tokenSymbol Token symbol
 * @returns Token balance information, including available balance, locked balance, and total balance
 */
export const getCexBalance = async (
    accountId: string,
    tokenSymbol: string
): Promise<CexTokenBalance | null> => {
    try {
        console.log(`getCexBalance called with: accountId=${accountId}, token=${tokenSymbol}`);

        const response = await lpHttp.get<CexTokenBalance>({
            url: `${Api.GET_CEX_TOKEN_BALANCE}/${accountId}/token/${tokenSymbol}`
        });

        console.log(`API response received for CEX balance:`, response);

        if (response) {
            console.log(`Found CEX balance for ${tokenSymbol}: free=${response.free}, locked=${response.locked}, total=${response.total}`);
            return response;
        } else {
            console.log(`No valid CEX balance found for token: ${tokenSymbol} in account: ${accountId}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching CEX token balance:', error);
        return null;
    }
};

/**
 * Get balances for all tokens in a CEX account
 * @param accountId CEX account ID
 * @returns Array of balance information for all tokens
 */
export const getAllCexTokenBalances = async (
    accountId: string
): Promise<CexTokenBalance[] | null> => {
    try {
        console.log(`getAllCexTokenBalances called with: accountId=${accountId}`);

        const result = await lpHttp.get<CexTokenBalance[]>({
            url: `${Api.GET_CEX_TOKEN_BALANCE}/${accountId}/tokens`
        });

        console.log(`API response received for CEX account tokens:`, result);

        if (result) {
            console.log(`Found ${result.length} tokens for CEX account: ${accountId}`);
            return result;
        } else {
            console.log(`No valid tokens found for CEX account: ${accountId}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching CEX account tokens:', error);
        return null;
    }
};

/**
 * Get list of all CEX accounts
 * @returns List of CEX accounts
 */
export const listCexAccounts = async (): Promise<CexAccount[] | null> => {
    try {
        console.log(`listCexAccounts called`);

        const result = await lpHttp.get<CexAccount[]>({
            url: `${Api.LIST_CEX_ACCOUNTS}`
        });

        console.log(`API response received for CEX accounts:`, result);

        if (result) {
            console.log(`Found ${result.length} CEX accounts`);
            return result;
        } else {
            console.log(`No valid CEX accounts found`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching CEX accounts:', error);
        return null;
    }
};
