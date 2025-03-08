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
