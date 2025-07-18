import { lpHttp } from '/@/utils/http/axios';

enum Api {
    GET_MARKET_PRICES = '/lpnode/lpnode_admin_panel/market/prices'
}

export interface TokenPrice {
    symbol: string;
    price: number;
}

/**
 * Get current market prices for all available tokens
 * @returns Array of token prices with their symbols
 */
export const getAllMarketPrices = async (): Promise<TokenPrice[] | null> => {
    try {
        console.log('getAllMarketPrices called');

        const result = await lpHttp.get<TokenPrice[]>({
            url: Api.GET_MARKET_PRICES
        });

        console.log('API response received for market prices:', result);

        if (result) {
            console.log(`Found prices for ${result.length} tokens`);
            return result;
        } else {
            console.log('No valid market prices found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching market prices:', error);
        return null;
    }
};

/**
 * Get current market price for a specific token
 * @param tokenSymbol Token symbol (e.g., "BTC", "ETH")
 * @returns Price information for the specified token, or null if not found
 */
export const getTokenPrice = async (tokenSymbol: string): Promise<TokenPrice | null> => {
    try {
        console.log(`getTokenPrice called for token: ${tokenSymbol}`);
        
        const prices = await getAllMarketPrices();
        
        if (!prices) {
            console.log('No prices available');
            return null;
        }
        
        const tokenPrice = prices.find(
            (item) => item.symbol.toUpperCase() === tokenSymbol.toUpperCase()
        );
        
        if (tokenPrice) {
            console.log(`Found price for ${tokenSymbol}: ${tokenPrice.price}`);
            return tokenPrice;
        } else {
            console.log(`Price not found for token: ${tokenSymbol}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching price for token ${tokenSymbol}:`, error);
        return null;
    }
};
