import { lpHttp } from '/@/utils/http/axios';

// Define exchange rate data interface
export interface ExchangeRate {
  _id?: string;
  symbol: string;
  asks: [string, string, string][]; // [price, quantity, identifier]
  bids: [string, string, string][]; // [price, quantity, identifier]
  incomingTimestamp: number;
  lastUpdateId: number;
  stdSymbol: string;
  stream: string;
  timestamp: number;
}

// API response interface
export interface ExchangeRatesResponse {
  code: number;
  message: string;
  result: ExchangeRate[];
}

// API path enumeration
enum Api {
  EXCHANGE_RATES = '/lpnode/lpnode_admin_panel/exchange/rates',
}

/**
 * Get all exchange rates
 * @returns List of exchange rate data
 */
export const getExchangeRates = () => 
  lpHttp.get<ExchangeRate[]>({ url: Api.EXCHANGE_RATES });

/**
 * Get specific exchange rate by trading pair
 * @param symbol Trading pair symbol, e.g. "USDC/USDT"
 * @returns Exchange rate data for the specific trading pair
 */
export const getExchangeRateBySymbol = (symbol: string, rates: ExchangeRate[]): ExchangeRate | undefined => {
  return rates.find(rate => rate.symbol === symbol);
};

/**
 * Get the exchange rate of a specific token to USD
 * @param token Token symbol, e.g. "USDC"
 * @param rates All exchange rate data
 * @returns Exchange rate value of token to USD
 */
export const getTokenUsdRate = (token: string, rates: ExchangeRate[]): number => {
  if (token === 'USDT') {
    return 1; // USDT is calculated at 1:1 directly
  }
  
  // Try to get the token to USDT exchange rate
  const rate = getExchangeRateBySymbol(`${token}/USDT`, rates);
  
  if (rate && rate.bids && rate.bids.length > 0) {
    // Use the highest bid price as the exchange rate
    return parseFloat(rate.bids[0][0]);
  }
  
  // If it's USDC and there's no direct rate to USDT
  if (token === 'USDC') {
    return 0.9995; // Default USDC exchange rate
  }
  
  return 0; // If no exchange rate is found, return 0
};

/**
 * Parse exchange rate data, convert to an easy-to-use format
 * @param rates Original exchange rate data
 * @returns Formatted exchange rate mapping
 */
export const parseExchangeRates = (rates: ExchangeRate[]): Record<string, number> => {
  const ratesMap: Record<string, number> = {};
  
  rates.forEach(rate => {
    if (rate.symbol && rate.bids && rate.bids.length > 0) {
      const bidPrice = parseFloat(rate.bids[0][0]);
      
      if (!isNaN(bidPrice)) {
        ratesMap[rate.symbol] = bidPrice;
        
        // Split the trading pair, store the inverse rate
        const [base, quote] = rate.symbol.split('/');
        
        // If it's a trading pair against USDT, store the rate against USD
        if (quote === 'USDT') {
          ratesMap[`${base}/USD`] = bidPrice;
        }
      }
    }
  });
  
  // Default USDT/USD exchange rate is 1
  ratesMap['USDT/USD'] = 1;
  
  return ratesMap;
};
