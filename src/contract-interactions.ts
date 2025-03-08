import { ethers } from 'ethers';
import type { UserDetails, LevelEarnings, NetworkConfig } from './types';

// Contract ABI (simplified for common functions)
const contractABI = [
  // View functions
  "function getOwner() view returns (address)",
  "function getUserDetails(address _user) view returns (bool registered, address upline, uint8 currentLevel, uint256 directReferralsCount, uint256 totalEarnings, uint256 registrationTime)",
  "function getUserLevelEarnings(address _user, uint8 _level) view returns (uint256 earningsForLevel, uint256 referralCountForLevel)",
  "function getDirectReferrals(address _user) view returns (address[])",
  "function isLevelActive(address _user, uint8 _level) view returns (bool)",
  "function getTotalUsers() view returns (uint256)",
  // Write functions
  "function register(address _upline) payable",
  "function buyLevel(uint8 _level) payable",
  // Events
  "event Registration(address indexed user, address indexed referrer, uint256 timestamp)",
  "event LevelPurchased(address indexed user, uint8 level, uint256 price, uint256 timestamp)",
  "event ReferralAdded(address indexed referrer, address indexed referral, uint256 timestamp)",
  "event PaymentReceived(address indexed receiver, address indexed payer, uint8 level, uint256 amount, uint256 timestamp)"
];

// Network configurations
const networkConfigs: Record<string, NetworkConfig> = {
  hardhat: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://localhost:8545',
    explorerUrl: '',
    contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Update to your deployment address
  },
  mumbai: {
    chainId: 80001,
    name: 'Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://mumbai.polygonscan.com',
    contractAddress: '' // Add your Mumbai deployment address
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    contractAddress: '' // Add your Polygon mainnet deployment address
  }
};

export class ContractInteractor {
  // Make provider public so it can be accessed by admin.ts
  public provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  private selectedNetwork: string = 'hardhat';

  constructor() {
    // Initialize provider if window.ethereum is available
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!this.provider) {
        console.error('Ethereum provider not available');
        if (typeof window !== 'undefined' && window.ethereum) {
          // Try reinitializing the provider
          this.provider = new ethers.BrowserProvider(window.ethereum);
        } else {
          alert("MetaMask is not installed. Please install MetaMask to use this application.");
          return null;
        }
      }

      // Try/catch around the request to handle potential errors
      try {
        // Show a message about waiting for wallet connection
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.style.display = 'flex';

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Wait a moment to ensure provider is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.signer = await this.provider.getSigner();
        const address = await this.signer.getAddress();
        
        await this.setupContract();
        
        // Hide loading overlay
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        return address;
      } catch (innerError) {
        console.error('MetaMask connection rejected or failed:', innerError);
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        if ((innerError as Error).message?.includes('User rejected')) {
          alert("Wallet connection was rejected. Please try again and approve the connection request.");
        } else {
          alert("Could not connect to your wallet. Please check that MetaMask is unlocked and try again.");
        }
        return null;
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      // Hide loading overlay
      const loadingOverlay = document.getElementById('loading-overlay');
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      
      return null;
    }
  }

  async setupContract(): Promise<boolean> {
    try {
      if (!this.signer) {
        console.error('Signer not available');
        return false;
      }

      const network = networkConfigs[this.selectedNetwork];
      if (!network || !network.contractAddress) {
        console.error('Network configuration or contract address not available');
        return false;
      }

      this.contract = new ethers.Contract(
        network.contractAddress,
        contractABI,
        this.signer
      );

      return true;
    } catch (error) {
      console.error('Error setting up contract:', error);
      return false;
    }
  }

  async switchNetwork(networkName: string): Promise<boolean> {
    try {
      const network = networkConfigs[networkName];
      if (!network) {
        console.error(`Network ${networkName} not configured`);
        return false;
      }

      this.selectedNetwork = networkName;
      
      if (this.provider && this.signer) {
        // Request network switch in MetaMask
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${network.chainId.toString(16)}` }]
          });
        } catch (switchError: any) {
          // Network doesn't exist in wallet
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${network.chainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.explorerUrl]
              }]
            });
          } else {
            throw switchError;
          }
        }

        await this.setupContract();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  }

  async getUserDetails(address: string): Promise<UserDetails | null> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return null;
      }

      const result = await this.contract.getUserDetails(address);
      return {
        registered: result[0],
        upline: result[1],
        currentLevel: Number(result[2]),
        directReferralsCount: Number(result[3]),
        totalEarnings: result[4],
        registrationTime: Number(result[5])
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      return null;
    }
  }

  async getUserLevelEarnings(address: string, level: number): Promise<LevelEarnings | null> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return null;
      }

      const result = await this.contract.getUserLevelEarnings(address, level);
      return {
        earningsForLevel: result[0],
        referralCountForLevel: Number(result[1])
      };
    } catch (error) {
      console.error('Error getting level earnings:', error);
      return null;
    }
  }

  async getDirectReferrals(address: string): Promise<string[]> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return [];
      }

      return await this.contract.getDirectReferrals(address);
    } catch (error) {
      console.error('Error getting direct referrals:', error);
      return [];
    }
  }

  async isLevelActive(address: string, level: number): Promise<boolean> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return false;
      }

      return await this.contract.isLevelActive(address, level);
    } catch (error) {
      console.error('Error checking if level is active:', error);
      return false;
    }
  }

  async getTotalUsers(): Promise<number> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return 0;
      }

      const result = await this.contract.getTotalUsers();
      return Number(result);
    } catch (error) {
      console.error('Error getting total users:', error);
      return 0;
    }
  }

  async registerUser(referrerAddress: string = ethers.ZeroAddress): Promise<boolean> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return false;
      }

      // Check if user is already registered before attempting registration
      try {
        if (!this.signer) {
          return false;
        }
        
        const address = await this.signer.getAddress();
        const userDetails = await this.getUserDetails(address);
        
        if (userDetails && userDetails.registered) {
          console.log('User is already registered');
          sessionStorage.setItem('isRegistered', 'true');
          return true; // Return true since the user is already in a valid registered state
        }
      } catch (checkError) {
        console.log('Error checking registration status:', checkError);
      }

      // If we get here, the user is not registered, so proceed with registration
      const tx = await this.contract.register(referrerAddress, {
        value: ethers.parseEther("200")  // Updated from 100 to 200 POL
      });
      await tx.wait();
      
      // Update session storage upon successful registration
      sessionStorage.setItem('isRegistered', 'true');
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Check if it's the "already registered" error and handle it gracefully
      if (error instanceof Error && error.message.includes("User already registered")) {
        alert("You are already registered in the MLM system.");
        sessionStorage.setItem('isRegistered', 'true');
        return true; // Return true because the user is in a valid registered state
      }
      
      return false;
    }
  }

  async buyLevel(level: number): Promise<boolean> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return false;
      }

      const levelPrice = await this.getLevelPrice(level);
      const tx = await this.contract.buyLevel(level, {
        value: levelPrice
      });
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error buying level:', error);
      return false;
    }
  }

  async getLevelPrice(level: number): Promise<bigint> {
    // Updated level prices as per the new contract with 200 POL base price
    const levelPrices: Record<number, string> = {
      1: "200",   // Updated from 100 to 200
      2: "600",   // Updated from 300 to 600
      3: "1800",  // Updated from 900 to 1800
      4: "5400",  // Updated from 2700 to 5400
      5: "16200", // Updated from 8100 to 16200
      6: "48600", // Updated from 24300 to 48600
      7: "145800", // Updated from 72900 to 145800
      8: "437400"  // Updated from 218700 to 437400
    };

    if (!levelPrices[level]) {
      console.error('Invalid level');
      return ethers.parseEther("0");
    }

    return ethers.parseEther(levelPrices[level]);
  }

  async getShortenedAddress(address: string): Promise<string> {
    if (!address || address === ethers.ZeroAddress) return "0x0...0000";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  getCurrentNetwork(): NetworkConfig {
    return networkConfigs[this.selectedNetwork];
  }

  disconnectWallet(): void {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  // Add this new method to fetch events from the blockchain
  async getUserEvents(userAddress: string): Promise<any[]> {
    try {
      if (!this.contract || !this.provider) {
        console.error('Contract or provider not initialized');
        return [];
      }
      
      // Get current block number
      const currentBlock = await this.provider.getBlockNumber();
      
      // We'll look back 10000 blocks or to the beginning if less
      const fromBlock = Math.max(0, currentBlock - 10000);
      
      // Get registration events where user is either the referrer or the one being registered
      const registrationFilter = this.contract.filters.Registration(userAddress, null);
      const referrerFilter = this.contract.filters.Registration(null, userAddress);
      
      // Get level purchase events
      const levelFilter = this.contract.filters.LevelPurchased(userAddress, null);
      
      // Get payment events where user received funds
      const paymentFilter = this.contract.filters.PaymentReceived(userAddress, null);
      
      // Fetch all relevant events
      const registrationEvents = await this.contract.queryFilter(registrationFilter, fromBlock);
      const referrerEvents = await this.contract.queryFilter(referrerFilter, fromBlock);
      const levelEvents = await this.contract.queryFilter(levelFilter, fromBlock);
      const paymentEvents = await this.contract.queryFilter(paymentFilter, fromBlock);
      
      // Combine all events and sort by timestamp (most recent first)
      const allEvents = [
        ...registrationEvents.map(e => ({ type: 'registered', ...e })),
        ...referrerEvents.map(e => ({ type: 'referee', ...e })),
        ...levelEvents.map(e => ({ type: 'level', ...e })),
        ...paymentEvents.map(e => ({ type: 'payment', ...e }))
      ];
      
      // Sort by block number (descending)
      allEvents.sort((a, b) => b.blockNumber - a.blockNumber);
      
      return allEvents;
    } catch (error) {
      console.error('Error getting user events:', error);
      return [];
    }
  }

  // Add missing methods needed by admin.ts
  async getOwner(): Promise<string> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return ethers.ZeroAddress;
      }

      return await this.contract.getOwner();
    } catch (error) {
      console.error('Error getting owner:', error);
      return ethers.ZeroAddress;
    }
  }

  async getContractBalance(): Promise<bigint> {
    try {
      if (!this.provider) {
        console.error('Provider not initialized');
        return BigInt(0);
      }

      const network = this.getCurrentNetwork();
      return await this.provider.getBalance(network.contractAddress);
    } catch (error) {
      console.error('Error getting contract balance:', error);
      return BigInt(0);
    }
  }

  async getTransactionCount(): Promise<number> {
    try {
      if (!this.provider) {
        console.error('Provider not initialized');
        return 0;
      }

      const network = this.getCurrentNetwork();
      const count = await this.provider.getTransactionCount(network.contractAddress);
      return Number(count);
    } catch (error) {
      console.error('Error getting transaction count:', error);
      return 0;
    }
  }

  async getRegistrationEvents(limit: number = 10): Promise<any[]> {
    try {
      if (!this.contract || !this.provider) {
        console.error('Contract or provider not initialized');
        return [];
      }

      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000); // Look back 10000 blocks

      const registrationFilter = this.contract.filters.Registration();
      const events = await this.contract.queryFilter(registrationFilter, fromBlock);
      
      return events
        .sort((a, b) => b.blockNumber - a.blockNumber) // Sort newest first
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting registration events:', error);
      return [];
    }
  }

  async getRegistrationsByDate(): Promise<{dates: string[], counts: number[]}> {
    try {
      if (!this.contract || !this.provider) {
        console.error('Contract or provider not initialized');
        return { dates: [], counts: [] };
      }

      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 100000); // Look back further for chart data

      const registrationFilter = this.contract.filters.Registration();
      const events = await this.contract.queryFilter(registrationFilter, fromBlock);
      
      // Group by date
      const dateGroups = new Map<string, number>();
      
      for (const event of events) {
        if (!('args' in event) || !event.args) continue;
        
        try {
          const timestamp = Number(event.args[2]) * 1000; // Convert to milliseconds
          const date = new Date(timestamp).toLocaleDateString();
          
          dateGroups.set(date, (dateGroups.get(date) || 0) + 1);
        } catch (error) {
          console.error('Error processing registration event:', error);
        }
      }
      
      // Sort dates chronologically
      const sortedDates = Array.from(dateGroups.keys()).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      
      // Get counts in the same order as sorted dates
      const counts = sortedDates.map(date => dateGroups.get(date) || 0);
      
      return { dates: sortedDates, counts };
    } catch (error) {
      console.error('Error processing registration data by date:', error);
      return { dates: [], counts: [] };
    }
  }

  async transferOwnership(newOwnerAddress: string): Promise<boolean> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return false;
      }

      const tx = await this.contract.transferOwnership(newOwnerAddress);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error transferring ownership:', error);
      return false;
    }
  }

  async emergencyWithdraw(): Promise<boolean> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        return false;
      }

      const tx = await this.contract.withdraw();
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      return false;
    }
  }

  async getCurrentWalletAddress(): Promise<string | null> {
    try {
      if (!this.signer) {
        return null;
      }
      
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error getting current wallet address:', error);
      return null;
    }
  }
}