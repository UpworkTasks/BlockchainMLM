/**
 * Wallet Connector Component
 * Provides utilities for connecting to different wallet providers
 */
import { showErrorToast, showInfoToast } from './toast-notification';

export interface WalletProvider {
  name: string;
  icon: string;
  description: string;
  isInstalled: () => boolean;
  connect: () => Promise<any>;
  provider?: any;
  getAccounts: () => Promise<string[]>;
}

// Define wallet providers
const walletProviders: WalletProvider[] = [
  {
    name: 'MetaMask',
    icon: 'https://cdn.prod.website-files.com/644a3d469d569d0a4b4c96db/67222c7eb2248bc9fe209821_advvaxlx1ndzaewhshzd.webp',
    description: 'Connect to your MetaMask Wallet',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
    connect: async () => {
      if (typeof window === 'undefined' || !window.ethereum?.isMetaMask) {
        window.open('https://metamask.io/download.html', '_blank');
        throw new Error('MetaMask is not installed');
      }
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return { provider: window.ethereum, accounts };
      } catch (error) {
        throw error;
      }
    },
    provider: window.ethereum,
    getAccounts: async () => {
      if (!window.ethereum?.isMetaMask) return [];
      try {
        return await window.ethereum.request({ method: 'eth_accounts' });
      } catch (error) {
        console.error("Failed to get MetaMask accounts:", error);
        return [];
      }
    }
  },
  {
    name: 'Crypto.com DeFi Wallet',
    icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.svg',
    description: 'Connect to your Crypto.com DeFi Wallet',
    isInstalled: () => {
      return typeof window !== 'undefined' && (!!window.ethereum?.isCrypto || !!window.deficonnect);
    },
    connect: async () => {
      // Crypto.com DeFi wallet could be available through window.ethereum or window.deficonnect
      const provider = window.ethereum?.isCrypto ? window.ethereum : window.deficonnect;
      
      if (!provider) {
        window.open('https://crypto.com/defi-wallet', '_blank');
        throw new Error('Crypto.com DeFi Wallet is not installed');
      }
      
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        return { provider, accounts };
      } catch (error) {
        throw error;
      }
    },
    provider: window.ethereum?.isCrypto ? window.ethereum : window.deficonnect,
    getAccounts: async () => {
      const provider = window.ethereum?.isCrypto ? window.ethereum : window.deficonnect;
      if (!provider) return [];
      
      try {
        return await provider.request({ method: 'eth_accounts' });
      } catch (error) {
        console.error("Failed to get Crypto.com DeFi Wallet accounts:", error);
        return [];
      }
    }
  },
  {
    name: 'Leap Wallet',
    icon: 'https://chainbroker.io/_next/image/?url=https%3A%2F%2Fstatic.chainbroker.io%2Fmediafiles%2Fprojects%2Fleap-wallet%2Fleap.jpeg&w=768&q=75',
    description: 'Connect to your Leap Wallet',
    isInstalled: () => typeof window !== 'undefined' && !!window.leap,
    connect: async () => {
      if (typeof window === 'undefined' || !window.leap) {
        window.open('https://www.leapwallet.io/', '_blank');
        throw new Error('Leap Wallet is not installed');
      }
      
      try {
        // Enable the wallet
        const accounts = await window.leap.enable();
        return { provider: window.leap, accounts };
      } catch (error) {
        throw error;
      }
    },
    provider: window.leap,
    getAccounts: async () => {
      if (!window.leap) return [];
      
      try {
        return await window.leap.getAccounts();
      } catch (error) {
        console.error("Failed to get Leap Wallet accounts:", error);
        return [];
      }
    }
  }
];

let selectedProvider: WalletProvider | null = null;

/**
 * Show wallet connection modal and return connected address
 */
export async function showWalletConnectModal(): Promise<string | null> {
  return new Promise((resolve) => {
    // Hide any existing loading overlay first to prevent multiple overlays
    const existingOverlay = document.getElementById('loading-overlay');
    if (existingOverlay && existingOverlay.style.display === 'flex') {
      existingOverlay.style.display = 'none';
    }
    
    // Create modal container
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50';
    modalOverlay.id = 'wallet-connect-modal-overlay';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all';
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'flex justify-between items-center mb-6';
    modalHeader.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800">Connect Wallet</h3>
      <button id="wallet-modal-close" class="text-gray-500 hover:text-gray-700 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    
    // Create wallet options container
    const walletOptions = document.createElement('div');
    walletOptions.className = 'space-y-3';
    
    // Add wallet options
    const installedWallets = walletProviders.filter(wallet => wallet.isInstalled());
    const uninstalledWallets = walletProviders.filter(wallet => !wallet.isInstalled());
    
    // Add installed wallets first
    installedWallets.forEach(wallet => {
      const walletOption = createWalletOption(wallet);
      walletOptions.appendChild(walletOption);
      
      // Add click event
      walletOption.addEventListener('click', async () => {
        try {
          showInfoToast(`Connecting to ${wallet.name}...`);
          
          selectedProvider = wallet;
          const result = await wallet.connect();
          
          if (result.accounts && result.accounts.length > 0) {
            closeModal();
            resolve(result.accounts[0]);
          } else {
            throw new Error(`No accounts found in ${wallet.name}`);
          }
        } catch (error) {
          console.error(`Error connecting to ${wallet.name}:`, error);
          showErrorToast(`Failed to connect to ${wallet.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Always hide loading overlay in case of error
          const loadingOverlay = document.getElementById('loading-overlay');
          if (loadingOverlay) loadingOverlay.style.display = 'none';
          
          closeModal();
          resolve(null);
        }
      });
    });
    
    // Add a separator if we have both installed and uninstalled wallets
    if (installedWallets.length > 0 && uninstalledWallets.length > 0) {
      const separator = document.createElement('div');
      separator.className = 'border-t border-gray-200 my-4';
      walletOptions.appendChild(separator);
      
      const notInstalledText = document.createElement('p');
      notInstalledText.className = 'text-sm text-gray-500 mb-3';
      notInstalledText.textContent = 'Not installed:';
      walletOptions.appendChild(notInstalledText);
    }
    
    // Add uninstalled wallets
    uninstalledWallets.forEach(wallet => {
      const walletOption = createWalletOption(wallet);
      walletOption.classList.add('opacity-60'); // Make it appear slightly disabled
      walletOptions.appendChild(walletOption);
      
      // Add install event
      walletOption.addEventListener('click', () => {
        let installUrl = '';
        switch(wallet.name) {
          case 'MetaMask':
            installUrl = 'https://metamask.io/download.html';
            break;
          case 'Crypto.com DeFi Wallet':
            installUrl = 'https://crypto.com/defi-wallet';
            break;
          case 'Leap Wallet':
            installUrl = 'https://www.leapwallet.io/';
            break;
        }
        
        if (installUrl) {
          window.open(installUrl, '_blank');
          showInfoToast(`Please install ${wallet.name} and reload the page`);
        }
      });
    });
    
    // Add components to modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(walletOptions);
    modalOverlay.appendChild(modalContent);
    
    // Add modal to document
    document.body.appendChild(modalOverlay);
    
    // Close modal on backdrop click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
        resolve(null);
      }
    });
    
    // Close modal on close button click
    const closeButton = modalContent.querySelector('#wallet-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        closeModal();
        resolve(null);
      });
    }
    
    // Function to close modal
    function closeModal() {
      // Make sure loading overlay is hidden when modal is closed
      const loadingOverlay = document.getElementById('loading-overlay');
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      
      modalOverlay.classList.add('opacity-0');
      setTimeout(() => {
        if (document.body.contains(modalOverlay)) {
          document.body.removeChild(modalOverlay);
        }
      }, 200);
    }
  });
}

/**
 * Create a wallet option element
 */
function createWalletOption(wallet: WalletProvider): HTMLDivElement {
  const walletOption = document.createElement('div');
  walletOption.className = 'flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors';
  
  // Create wallet icon
  const walletIcon = document.createElement('img');
  walletIcon.src = wallet.icon;
  walletIcon.alt = `${wallet.name} logo`;
  walletIcon.className = 'w-8 h-8 mr-3';
  
  // Create wallet info container
  const walletInfo = document.createElement('div');
  walletInfo.className = 'flex-grow';
  
  // Create wallet name
  const walletName = document.createElement('div');
  walletName.className = 'font-medium text-gray-800';
  walletName.textContent = wallet.name;
  
  // Create wallet description
  const walletDesc = document.createElement('div');
  walletDesc.className = 'text-xs text-gray-500';
  walletDesc.textContent = wallet.isInstalled() 
    ? wallet.description 
    : `Install ${wallet.name} to connect`;
  
  // Assemble the wallet option
  walletInfo.appendChild(walletName);
  walletInfo.appendChild(walletDesc);
  walletOption.appendChild(walletIcon);
  walletOption.appendChild(walletInfo);
  
  // Add status indicator for installed wallets
  if (wallet.isInstalled()) {
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'w-3 h-3 bg-green-500 rounded-full';
    walletOption.appendChild(statusIndicator);
  } else {
    const downloadIcon = document.createElement('div');
    downloadIcon.innerHTML = `
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
      </svg>
    `;
    walletOption.appendChild(downloadIcon);
  }
  
  return walletOption;
}

/**
 * Get the currently selected wallet provider
 */
export function getSelectedProvider(): WalletProvider | null {
  return selectedProvider;
}

/**
 * Close the wallet selection modal
 */
export function closeWalletModal(): void {
  const modalOverlay = document.getElementById('wallet-connect-modal-overlay');
  if (modalOverlay) {
    modalOverlay.remove();
  }
}
