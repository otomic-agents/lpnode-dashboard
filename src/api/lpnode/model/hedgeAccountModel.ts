// Hedge account creation request parameters
export interface CreateHedgeAccountParams {
  name: string;
  exchange: string;
  api_key: string;
  api_secret: string;
  passphrase?: string;
}

// API response structure
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface HedgeAccount {
  id: string;
  name: string;
  exchange: string;
  api_key: string;
  status: string;
}

export interface HedgeAccountListResult {
  code: number;
  message: string;
  data: HedgeAccount[];
}

// Type definitions previously used when creating accounts
export interface CreateHedgeAccountParams {
  name: string;
  exchange: string;
  api_key: string;
  api_secret: string;
  passphrase?: string;
}

export interface CreateHedgeAccountResult {
  code: number;
  message: string;
  data: HedgeAccount;
}

export interface HedgeTask {
  id: string;
  hedge_id: string;
  name: string;
  exchange: string;
  api_key: string;
  api_secret: string;
  passphrase?: string;
  bridge_id: string;
  pair: string;
  chain_pair: string[];
  amm_name: string;
  account_id: string;
  status: string;
  status_desc: string;
  locked_by_hedge: boolean;
  active_period: {
    start: string;
    end: string;
  };
  initial_snapshot: {
    cex: Record<string, number>;
    dex: Record<string, number>;
    timestamp: string;
  };
  current_snapshot: {
    cex: Record<string, number>;
    dex: Record<string, number>;
    timestamp: string;
  };
  exposure: {
    total_usd: number;
    [key: string]: number;
  };
  risk_config: {
    max_asset_exposure: Record<string, number>;
    min_hedge_amount: Record<string, number>;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
  version: number;
}

/**
* Parameters for creating a hedge task
*/
export interface CreateHedgeTaskParams {
  /**
   * Task name
   * @example "ETH-USDT Hedge Task"
   */
  name: string;

  /**
   * Associated account ID
   * @example "60c72b2f9b1d8e001c8a4d5f"
   */
  account_id: string;

  /**
   * Associated bridge ID
   * @example "60c72b2f9b1d8e001c8a4d60"
   */
  bridge_id: string;

  /**
   * AMM name
   * @example "Uniswap"
   */
  amm_name: string;
}

// Wallet information interface
export interface WalletInfo {
  token: string;
  cex: string;
  dex: string;
  total: number;
  wallet: string;
  walletName: string;
}

// Initial balances interface
export interface InitialBalances {
  source: WalletInfo;
  destination: WalletInfo;
}

// Risk configuration interface
export interface RiskConfig {
  max_asset_exposure: Record<string, number>;
  min_hedge_amount: Record<string, number>;
  hedge_mode: string;
}

// Parameters interface for saving hedge data
export interface SaveHedgeDataParams {
  id: string;
  hedgeTaskId: string;
  initialBalances: InitialBalances;
  name: string;
  bridge_id: string;
  cex_account_id: string;
  amm_name: string;
  risk_config: RiskConfig;
}

// Result interface for saving hedge data
export interface SaveHedgeDataResult {
  id: string;
  name: string;
  status: string;
}
