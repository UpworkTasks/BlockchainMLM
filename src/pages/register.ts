import { ContractInteractor } from "../contract-interactions";
import { ethers } from "ethers";

export async function loadRegisterPage(
  container: HTMLElement,
  contractInteractor: ContractInteractor,
  currentUserAddress: string | null,
  isRegistered: boolean
) {
  // Double-check registration status if wallet is connected
  if (currentUserAddress) {
    try {
      const userDetails = await contractInteractor.getUserDetails(currentUserAddress);
      if (userDetails && userDetails.registered) {
        isRegistered = true;
        // Update the global status through session storage
        sessionStorage.setItem('isRegistered', 'true');
      }
    } catch (error) {
      console.log("Error double-checking registration:", error);
    }
  }

  // Create register page layout
  container.innerHTML = `
    <div class="p-4" id="register-content">
  
      
      ${!currentUserAddress ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <p class="mb-4">Please connect your wallet to register in the MLM system.</p>
          <button id="register-connect-wallet" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Connect Wallet
          </button>
        </div>
      ` : isRegistered ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold text-green-600 mb-2">You're already registered!</h3>
          <p class="mb-4">Your wallet is already registered in the Polygon MLM Network.</p>
          <p class="mb-4">Start inviting others and upgrading your levels to increase your earnings.</p>
          <button id="go-to-dashboard" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Go to Dashboard
          </button>
        </div>
      ` : `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Registration Details</h3>
          
          <div class="mb-6">
            <label for="referrer-input" class="block mb-2 text-sm font-medium text-gray-900">Referrer Address</label>
            <input type="text" id="referrer-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-polygon-purple focus:border-polygon-purple block w-full p-2.5" placeholder="0x...">
            <p class="mt-2 text-sm text-gray-500">Leave blank to be assigned a system referrer</p>
          </div>
          
          <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-polygon-purple" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span class="font-medium">Registration cost: <span class="font-bold">200 POL</span></span>
            </div>
            <p class="mt-2 text-sm text-gray-500">This payment goes directly to your referrer. It also unlocks Level 1 in the system.</p>
          </div>
          
          <button id="register-button" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Register Now
          </button>
        </div>
        
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">How Registration Works</h3>
          
          <div class="mb-4">
            <ol class="list-decimal list-inside space-y-2 text-gray-700">
              <li>Connect your Polygon wallet</li>
              <li>Enter your referrer's address (optional)</li>
              <li>Pay 200 POL registration fee</li>
              <li>The fee will go directly to your referrer</li>
              <li>You're registered at Level 1 and can start referring others</li>
            </ol>
          </div>
        </div>
      `}
    </div>
  `;

  // Connect wallet button
  const connectWalletBtn = document.getElementById("register-connect-wallet");
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", async () => {
      currentUserAddress = await contractInteractor.connectWallet();
      if (currentUserAddress) {
        const userDetails = await contractInteractor.getUserDetails(currentUserAddress);
        isRegistered = userDetails?.registered || false;
        loadRegisterPage(container, contractInteractor, currentUserAddress, isRegistered);
      }
    });
  }

  // Go to dashboard button
  const dashboardBtn = document.getElementById("go-to-dashboard");
  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", () => {
      localStorage.setItem("activePage", "dashboard");
      window.dispatchEvent(new Event('navigate'));
    });
  }

  // Registration button
  const registerBtn = document.getElementById("register-button") as HTMLButtonElement;
  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      if (!currentUserAddress) return;

      try {
        registerBtn.disabled = true;
        registerBtn.textContent = "Registering...";
        
        // Get referrer address
        const referrerInput = document.getElementById("referrer-input") as HTMLInputElement;
        let referrer = referrerInput.value.trim();
        
        // If no referrer is provided, check localStorage for a referrer from URL
        if (!referrer) {
          const storedReferrer = localStorage.getItem('referrer');
          if (storedReferrer) {
            referrer = storedReferrer;
          } else {
            referrer = ethers.ZeroAddress; // Use zero address for system-assigned referrer
          }
        }
        
        // Register user
        const success = await contractInteractor.registerUser(referrer);
        
        if (success) {
          alert("Registration successful! You are now a member of the Polygon MLM Network.");
          localStorage.removeItem('referrer'); // Clear stored referrer
          sessionStorage.setItem('isRegistered', 'true'); // Update session storage
          isRegistered = true;
          loadRegisterPage(container, contractInteractor, currentUserAddress, true);
        } else {
          alert("Registration failed. Please try again.");
          registerBtn.disabled = false;
          registerBtn.textContent = "Register Now";
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
        registerBtn.disabled = false;
        registerBtn.textContent = "Register Now";
      }
    });
  }
}
