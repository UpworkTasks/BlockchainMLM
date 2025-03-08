import { ethers } from 'ethers';
import { UserDetails, LevelEarnings, NetworkConfig } from './types';
import { showErrorToast, showSuccessToast, showInfoToast } from './components/toast-notification';
import { showWalletConnectModal, getSelectedProvider } from './components/wallet-connector';

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

// Network configurations - Only Polygon mainnet now
const networkConfigs: Record<string, NetworkConfig> = {
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    contractAddress: '0x09682E1B66797aA71F1735baCeA3d525883D3D58'  // Polygon mainnet deployment address
  }
};

export class ContractInteractor {
  // Make provider public so it can be accessed by admin.ts
  public provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  private selectedNetwork: string = 'polygon'; // Default to Polygon mainnet

  constructor() {
    // Provider will be set when a wallet is connected
  }

  async connectWallet(): Promise<string | null> {
    // Keep track of whether we showed the loading overlay
    let loadingOverlayDisplayed = false;
    
    try {
      // Show wallet selection modal
      const selectedAddress = await showWalletConnectModal();
      
      if (!selectedAddress) {
        console.log('No wallet selected or connection canceled');
        
        // Ensure loading overlay is hidden
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        return null;
      }
      
      // Get the selected provider from the wallet connector
      const walletProvider = getSelectedProvider();
      
      if (!walletProvider?.provider) {
        showErrorToast("Selected wallet provider not available");
        return null;
      }
      
      // Set up provider with the selected wallet
      this.provider = new ethers.BrowserProvider(walletProvider.provider);
      
      // Show a message about waiting for wallet connection (only if not already showing)
      const loadingOverlay = document.getElementById('loading-overlay');
      if (loadingOverlay && loadingOverlay.style.display !== 'flex') {
        loadingOverlay.style.display = 'flex';
        loadingOverlayDisplayed = true;
      }
      
      // Ensure we're on Polygon network
      await this.ensurePolygonNetwork();
      
      try {
        // Get signer from provider
        this.signer = await this.provider.getSigner();
        const address = await this.signer.getAddress();
        
        await this.setupContract();
        
        // Hide loading overlay if we displayed it
        if (loadingOverlayDisplayed && loadingOverlay) {
          loadingOverlay.style.display = 'none';
        }
        
        showSuccessToast(`${walletProvider.name} wallet connected successfully`);
        return address;
      } catch (innerError) {
        console.error('Wallet connection rejected or failed:', innerError);
        
        // Hide loading overlay if we displayed it
        if (loadingOverlayDisplayed && loadingOverlay) {
          loadingOverlay.style.display = 'none';
        }
        
        if ((innerError as Error).message?.includes('User rejected')) {
          showErrorToast("Wallet connection was rejected. Please try again and approve the connection request.");
        } else {
          showErrorToast(`Could not connect to ${walletProvider.name}. Please check that your wallet is unlocked and try again.`);
        }
        return null;
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      // Hide loading overlay regardless of who showed it
      const loadingOverlay = document.getElementById('loading-overlay');
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      
      showErrorToast("Failed to connect wallet: " + (error instanceof Error ? error.message : "Unknown error"));
      return null;
    }
  }

  // New method to ensure user is on Polygon network
  async ensurePolygonNetwork(): Promise<boolean> {
    try {
      const network = networkConfigs.polygon;
      // Use optional chaining to avoid errors if provider methods aren't available
      const chainId = await window?.ethereum?.request?.({ method: 'eth_chainId' });
      
      if (!chainId) {
        showErrorToast("Could not detect network. Please make sure your wallet is connected.");
        return false;
      }
      
      if (parseInt(chainId, 16) !== network.chainId) {
        showInfoToast("Switching to Polygon network...");
        
        try {
          // Safe access to wallet methods
          if (!window?.ethereum?.request) {
            showErrorToast("Wallet doesn't support network switching");
            return false;
          }
          
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${network.chainId.toString(16)}` }]
          });
        } catch (switchError: any) {
          // Network doesn't exist in wallet
          if (switchError.code === 4902) {
            try {
              await window?.ethereum?.request({
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
              
              showSuccessToast("Polygon network added to wallet");
            } catch (addError) {
              showErrorToast("Failed to add Polygon network to wallet");
              throw addError;
            }
          } else {
            showErrorToast("Failed to switch to Polygon network");
            throw switchError;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error ensuring Polygon network:', error);
      return false;
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
      showErrorToast("Failed to setup contract: " + (error instanceof Error ? error.message : "Unknown error"));
      return false;
    }
  }

  // Replace switchNetwork with a method that ensures Polygon network
  async switchNetwork(): Promise<boolean> {
    return this.ensurePolygonNetwork();
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
      showErrorToast("Failed to get user details: " + (error instanceof Error ? error.message : "Unknown error"));
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
      showErrorToast("Failed to get level earnings: " + (error instanceof Error ? error.message : "Unknown error"));
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
      showErrorToast("Failed to get referrals: " + (error instanceof Error ? error.message : "Unknown error"));
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
      showErrorToast("Failed to check level status: " + (error instanceof Error ? error.message : "Unknown error"));
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
      showErrorToast("Failed to get total users: " + (error instanceof Error ? error.message : "Unknown error"));
      return 0;
    }
  }

  async registerUser(referrerAddress: string = ethers.ZeroAddress): Promise<boolean> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        showErrorToast("Contract not initialized. Please connect your wallet.");
        return false;
      }

      // Check if user is already registered before attempting registration
      try {
        if (!this.signer) {
          showErrorToast("Wallet not connected");
          return false;
        }
        
        const address = await this.signer.getAddress();
        const userDetails = await this.getUserDetails(address);
        
        if (userDetails && userDetails.registered) {
          console.log('User is already registered');
          sessionStorage.setItem('isRegistered', 'true');
          showInfoToast("You are already registered in the MLM system");
          return true; // Return true since the user is already in a valid registered state
        }
        
        // PRE-CHECK: Check if the user has enough balance to complete the registration
        if (this.provider) {
          try {
            const balance = await this.provider.getBalance(address);
            const requiredAmount = ethers.parseEther("200"); // 200 POL for registration
            const estimatedGas = ethers.parseEther("0.01"); // Rough estimate for gas
            const totalRequired = requiredAmount + estimatedGas;
            
            if (balance < totalRequired) {
              const formattedRequired = ethers.formatEther(requiredAmount);
              const formattedBalance = ethers.formatEther(balance);
              
              showErrorToast(
                `Insufficient funds to register. You need at least ${formattedRequired} MATIC for registration plus gas.` +
                ` Your current balance is ${formattedBalance} MATIC.`
              );
              return false;
            }
            
            console.log(`User has sufficient balance: ${ethers.formatEther(balance)} MATIC`);
          } catch (balanceError) {
            console.error("Failed to check balance:", balanceError);
            // Continue with transaction attempt even if balance check fails
          }
        }
        
      } catch (checkError) {
        console.log('Error checking registration status:', checkError);
        showErrorToast("Error checking registration status: " + (checkError instanceof Error ? checkError.message : "Unknown error"));
      }

      // If we get here, the user is not registered, so proceed with registration
      showInfoToast("Please confirm the transaction in your wallet...");
      
      try {
        // Explicitly set gas limit to avoid estimation failures
        const gasLimit = 300000; // Safe gas limit for registration
        
        const tx = await this.contract.register(referrerAddress, {
          value: ethers.parseEther("200"),
          gasLimit: gasLimit
        });
        
        showInfoToast("Transaction submitted, waiting for confirmation...");
        await tx.wait();
        
        // Update session storage upon successful registration
        sessionStorage.setItem('isRegistered', 'true');
        showSuccessToast("Registration successful! Welcome to the MLM system.");
        return true;
      } catch (txError: any) {
        // Extract and display the specific error message
        console.error('Transaction error:', txError);
        
        // Improved error handling with more specific messages
        if (txError.shortMessage?.includes("insufficient funds") || 
            txError.message?.includes("insufficient funds") ||
            txError.code === "INSUFFICIENT_FUNDS") {
          showErrorToast(
            "Registration failed: You don't have enough MATIC in your wallet. " +
            "You need 200 MATIC for registration plus additional MATIC for gas fees."
          );
        } else if (txError.message?.includes("estimate gas") || txError.code === "CALL_EXCEPTION") {
          // This is likely an insufficient funds error that wasn't caught by the normal checks
          showErrorToast(
            "Transaction failed during gas estimation. This usually means you have insufficient funds. " +
            "Please make sure you have at least 200.1 MATIC in your wallet."
          );
        } else if (txError.shortMessage?.includes("gas required exceeds allowance")) {
          showErrorToast("Registration failed: Gas estimation error. You may have insufficient funds to pay for gas fees.");
        } else if (txError.shortMessage?.includes("User already registered") || 
                  txError.message?.includes("User already registered")) {
          showInfoToast("You are already registered in the MLM system");
          sessionStorage.setItem('isRegistered', 'true');
          return true;
        } else if (txError.code === 4001 || txError.message?.includes("rejected")) {
          showErrorToast("Registration transaction was rejected. Please try again when you're ready.");
        } else {
          // Show actual error message instead of generic one
          showErrorToast(`Registration failed: ${txError.shortMessage || txError.message || "Unknown error"}`);
        }
        return false;
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      
      // More specific error handling
      if (error.message?.includes("User already registered")) {
        showInfoToast("You are already registered in the MLM system");
        sessionStorage.setItem('isRegistered', 'true');
        return true;
      } else if (error.message?.includes("insufficient funds") || error.code === "INSUFFICIENT_FUNDS") {
        showErrorToast(
          "Registration failed: Insufficient funds. " +
          "You need 200 MATIC for registration plus gas fees (approximately 0.1 MATIC)."
        );
      } else if (error.code === 4001) {
        showErrorToast("Transaction rejected. Please try again if you want to register.");
      } else {
        showErrorToast(`Registration failed: ${error.shortMessage || error.message || "Unknown error"}`);
      }
      
      return false;
    }
  }

  async buyLevel(level: number): Promise<boolean> {
    try {
      if (!this.contract) {
        console.error('Contract not initialized');
        showErrorToast("Contract not initialized. Please connect your wallet.");
        return false;
      }

      const levelPrice = await this.getLevelPrice(level);
      
      showInfoToast(`Please confirm the transaction to buy level ${level}...`);
      
      try {
        const tx = await this.contract.buyLevel(level, {
          value: levelPrice
        });
        
        showInfoToast("Transaction submitted, waiting for confirmation...");
        await tx.wait();
        
        showSuccessToast(`Successfully purchased level ${level}!`);
        return true;
      } catch (txError: any) {
        console.error('Error during level purchase transaction:', txError);
        
        if (txError.shortMessage?.includes("insufficient funds") || 
            txError.message?.includes("insufficient funds")) {
          showErrorToast(`Failed to purchase level ${level}: Insufficient funds in your wallet. This level costs ${ethers.formatEther(levelPrice)} MATIC.`);
        } else if (txError.code === 4001 || txError.message?.includes("rejected")) {
          showErrorToast("Transaction was rejected. You can try again when you're ready.");
        } else if (txError.message?.includes("user already has this level")) {
          showInfoToast(`You already own level ${level}`);
          return true;
        } else {
          showErrorToast(`Failed to purchase level ${level}: ${txError.shortMessage || txError.message || "Unknown error"}`);
        }
        return false;
      }
    } catch (error: any) {
      console.error('Error buying level:', error);
      
      // More specific error messages
      if (error.message?.includes("insufficient funds")) {
        const formatted = ethers.formatEther(await this.getLevelPrice(level));
        showErrorToast(`Failed to purchase level ${level}: You need at least ${formatted} MATIC to buy this level.`);
      } else if (error.code === 4001) {
        showErrorToast("Transaction was rejected. Please try again if you want to purchase the level.");
      } else {
        showErrorToast(`Failed to purchase level ${level}: ${error.shortMessage || error.message || "Unknown error"}`);
      }
      
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

  // Update getCurrentNetwork to always return Polygon
  getCurrentNetwork(): NetworkConfig {
    return networkConfigs.polygon;
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

  // Update getCurrentWalletInfo method to include wallet type
  async getCurrentWalletInfo(): Promise<{address: string | null, type: string | null}> {
    try {
      if (!this.signer) {
        return {
          address: null,
          type: null
        };
      }
      
      const address = await this.signer.getAddress();
      const walletProvider = getSelectedProvider();
      
      return {
        address: address,
        type: walletProvider?.name || 'Unknown'
      };
    } catch (error) {
      console.error('Error getting current wallet info:', error);
      return {
        address: null,
        type: null
      };
    }
  }
}