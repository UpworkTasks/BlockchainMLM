import { ContractInteractor } from "../contract-interactions";
import { showSuccessToast, showErrorToast } from "../components/toast-notification";
import { ethers } from "ethers";

export async function loadRegisterPage(
  container: HTMLElement,
  contractInteractor: ContractInteractor,
  currentUserAddress: string | null,
  isRegistered: boolean
) {
  // Add a registration fee notice and balance checker
  container.innerHTML = `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6">Register to MLM Network</h2>
      
      ${!currentUserAddress ? `
        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <h3 class="text-xl font-bold mb-3">Connect Your Wallet</h3>
          <p class="mb-4">Please connect your wallet to register with our MLM network.</p>
          <button id="register-connect-wallet" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Connect Wallet
          </button>
        </div>
      ` : isRegistered ? `
        <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm leading-5 font-medium text-green-800">
                You are already registered with our MLM network!
              </p>
              <p class="text-sm leading-5 text-green-700 mt-1">
                Visit your dashboard to see your earnings and referrals.
              </p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-3">Your Dashboard</h3>
            <p class="mb-4">Check your current status, earnings, and referrals.</p>
            <button id="go-to-dashboard" class="w-full sm:w-auto px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
              Go to Dashboard
            </button>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-3">Your Referral Link</h3>
            <p class="mb-4">Share this link to invite others to join under you.</p>
            <div class="flex">
              <input id="referral-link" type="text" class="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50" readonly value="Loading...">
              <button id="copy-referral-link" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-r-lg border-t border-r border-b border-gray-300">
                Copy
              </button>
            </div>
          </div>
        </div>
      ` : `
        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <div class="mb-6 pb-6 border-b border-gray-200">
            <h3 class="text-xl font-bold mb-3">Registration Details</h3>
            <p class="text-gray-600 mb-2">Join our MLM network to start earning passive income through referrals.</p>
            
            <div class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm leading-5 font-medium text-blue-800">
                    Registration Fee: 200 MATIC
                  </p>
                  <p class="text-sm leading-5 text-blue-700 mt-1">
                    You'll also need approximately 0.1 MATIC for gas fees.
                  </p>
                  <div class="mt-2" id="wallet-balance-info">
                    <span class="font-semibold text-sm">Loading your balance...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-bold mb-3">Referrer (Optional)</h4>
            <div id="referrer-container" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Referrer's Address</label>
              <input id="referrer-address" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-polygon-purple focus:border-polygon-purple" placeholder="Leave empty to join without referrer">
              <p class="mt-2 text-sm text-gray-500">You can join with or without a referrer.</p>
            </div>
            
            <div class="flex flex-col sm:flex-row sm:justify-between gap-3 items-center">
              <button id="register-button" class="w-full sm:w-auto px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
                Register Now
              </button>
              <p id="registration-fee" class="text-sm text-gray-600">Fee: 200 MATIC + gas</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-xl font-bold mb-3">Registration Benefits</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li class="text-gray-700">Access to our 8-level MLM earnings structure</li>
            <li class="text-gray-700">Earn commissions from your direct and indirect referrals</li>
            <li class="text-gray-700">No time limits or expiration on your registration</li>
            <li class="text-gray-700">Transparent blockchain-based earnings tracking</li>
          </ul>
        </div>
      `}
    </div>
  `;
  
  // Connect button handler
  const connectBtn = document.getElementById("register-connect-wallet");
  if (connectBtn) {
    connectBtn.addEventListener("click", async () => {
      const address = await contractInteractor.connectWallet();
      if (address) {
        // Reload the page after connection
        loadRegisterPage(container, contractInteractor, address, isRegistered);
      }
    });
  }
  
  // Dashboard button handler
  const dashboardBtn = document.getElementById("go-to-dashboard");
  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", () => {
      localStorage.setItem("activePage", "dashboard");
      window.dispatchEvent(new Event("navigate"));
    });
  }
  
  // Fill and handle referral link for registered users
  const referralLinkInput = document.getElementById("referral-link") as HTMLInputElement;
  const copyReferralLinkBtn = document.getElementById("copy-referral-link");
  if (currentUserAddress && isRegistered && referralLinkInput && copyReferralLinkBtn) {
    // Generate the referral link with the current address
    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${currentUserAddress}`;
    referralLinkInput.value = referralLink;
    
    copyReferralLinkBtn.addEventListener("click", () => {
      referralLinkInput.select();
      document.execCommand("copy");
      
      // Show copy feedback
      copyReferralLinkBtn.textContent = "Copied!";
      setTimeout(() => {
        copyReferralLinkBtn.textContent = "Copy";
      }, 2000);
    });
  }
  
  // Check for referrer in local storage if address field is available
  const referrerInput = document.getElementById("referrer-address") as HTMLInputElement;
  if (referrerInput) {
    const storedReferrer = localStorage.getItem('referrer');
    if (storedReferrer) {
      referrerInput.value = storedReferrer;
    }
  }
  
  // Register button handler
  const registerBtn = document.getElementById("register-button");
  if (registerBtn && currentUserAddress && !isRegistered) {
    registerBtn.addEventListener("click", async () => {
      registerBtn.setAttribute("disabled", "true");
      registerBtn.textContent = "Processing...";
      
      try {
        let referrerAddress = "";
        const referrerInput = document.getElementById("referrer-address") as HTMLInputElement;
        
        // Only validate referrer if address was entered
        if (referrerInput && referrerInput.value.trim()) {
          if (/^0x[a-fA-F0-9]{40}$/.test(referrerInput.value.trim())) {
            referrerAddress = referrerInput.value.trim();
          } else {
            showErrorToast("Invalid referrer address format. Please use a valid address or leave empty.");
            registerBtn.removeAttribute("disabled");
            registerBtn.textContent = "Register Now";
            return;
          }
        }
        
        // Pass empty string or valid address to registerUser
        const success = await contractInteractor.registerUser(referrerAddress || ethers.ZeroAddress);
        if (success) {
          // Update status and show success message
          showSuccessToast("Registration successful! Welcome to the MLM network!");
          
          // Reload the page with updated registration status
          setTimeout(() => {
            loadRegisterPage(container, contractInteractor, currentUserAddress, true);
          }, 1000);
        } else {
          registerBtn.removeAttribute("disabled");
          registerBtn.textContent = "Register Now";
        }
      } catch (error) {
        console.error("Registration error:", error);
        showErrorToast("Failed to register: " + (error instanceof Error ? error.message : "Unknown error"));
        registerBtn.removeAttribute("disabled");
        registerBtn.textContent = "Register Now";
      }
    });
    
    // Add balance checking
    const walletBalanceInfo = document.getElementById("wallet-balance-info");
    if (walletBalanceInfo && contractInteractor.provider) {
      try {
        const balance = await contractInteractor.provider.getBalance(currentUserAddress);
        const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(4);
        const requiredAmount = 200; // MATIC
        
        if (parseFloat(formattedBalance) < requiredAmount) {
          walletBalanceInfo.innerHTML = `
            <span class="text-red-600 font-semibold text-sm">
              Your balance: ${formattedBalance} MATIC (Insufficient funds)
            </span>
            <div class="mt-1 text-xs text-red-600">
              You need at least ${requiredAmount} MATIC + gas to register.
            </div>
          `;
          // Disable register button
          registerBtn.setAttribute("disabled", "true");
          registerBtn.classList.add("opacity-50", "cursor-not-allowed");
        } else {
          walletBalanceInfo.innerHTML = `
            <span class="text-green-600 font-semibold text-sm">
              Your balance: ${formattedBalance} MATIC (Sufficient funds)
            </span>
          `;
        }
      } catch (error) {
        console.error("Error getting balance:", error);
        walletBalanceInfo.innerHTML = `
          <span class="text-gray-600 text-sm">Couldn't retrieve your balance</span>
        `;
      }
    }
  }
}

async function enableRegisterButton(contractInteractor: ContractInteractor, address: string): Promise<void> {
  const registerButton = document.getElementById('register-button') as HTMLButtonElement;
  if (!registerButton) return;

  try {
    // Check balance
    const provider = contractInteractor.provider;
    if (!provider) {
      registerButton.disabled = true;
      return;
    }

    const balance = await provider.getBalance(address);
    const requiredAmount = ethers.parseEther("200.1"); // 200 MATIC + 0.1 for gas
    const hasEnoughBalance = balance >= requiredAmount;

    // Update button state
    registerButton.disabled = !hasEnoughBalance;
    
    // Update button text based on state
    if (!hasEnoughBalance) {
      const formattedBalance = ethers.formatEther(balance);
      registerButton.textContent = `Insufficient Balance (${formattedBalance} MATIC)`;
      registerButton.classList.add('bg-gray-400');
      registerButton.classList.remove('bg-polygon-purple', 'hover:bg-polygon-dark');
    } else {
      registerButton.textContent = 'Register Now';
      registerButton.classList.remove('bg-gray-400');
      registerButton.classList.add('bg-polygon-purple', 'hover:bg-polygon-dark');
    }

    console.log('Register button state:', {
      balance: ethers.formatEther(balance),
      required: ethers.formatEther(requiredAmount),
      hasEnough: hasEnoughBalance
    });

  } catch (error) {
    console.error('Error checking balance for register button:', error);
    registerButton.disabled = true;
  }
}
