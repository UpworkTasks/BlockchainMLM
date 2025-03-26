// Type definitions for the BlockchainMLM application

// User details returned from the contract
export interface UserDetails {
  registered: boolean;
  upline: string;
  currentLevel: number;
  directReferralsCount: number;
  totalEarnings: bigint;
  registrationTime: number;
}

// Level earnings for a specific level
export interface LevelEarnings {
  earningsForLevel: bigint;
  referralCountForLevel: number;
}

// Network configuration for different blockchains
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  contractAddress: string;
}

// Referral user data for display
export interface ReferralUser {
  address: string;
  displayAddress: string;
  registrationTime: number;
  level: number;
  hasReferrals: boolean;
  expanded?: boolean;
}

// Contract event type for activity tracking
export interface ContractEvent {
  type: 'registration' | 'level_purchase' | 'referral' | 'payment';
  address?: string;
  level?: number;
  amount?: string;
  time: string;
  blockNumber: number;
  transactionHash: string;
}

// UI state interface for managing application state
export interface UIState {
  isWalletConnected: boolean;
  isRegistered: boolean;
  userAddress: string | null;
  networkName: string;
  isLoading: boolean;
  currentPage: string;
}

// Global type declarations
declare global {
  interface Window {
    ethereum?: any;
    deficonnect?: any;
    leap?: {
      ethereum: {
        isLeap?: boolean;
        isLeapWallet?: boolean;
        provider?: {
          name?: string;
        };
        request: (args: { method: string; params?: any[] }) => Promise<any>;
        on: (event: string, handler: (...args: any[]) => void) => void;
        removeListener: (event: string, handler: (...args: any[]) => void) => void;
        autoRefreshOnNetworkChange?: boolean;
      };
      enable: (chainId?: string) => Promise<void>;
      getOfflineSignerAuto: (chainId: string) => any;
      getKey: (chainId: string) => Promise<{ bech32Address: string }>;
    };
  }
}
