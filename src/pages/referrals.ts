import { ContractInteractor } from "../contract-interactions";
import { ethers } from "ethers";

export async function loadReferralsPage(
  container: HTMLElement,
  contractInteractor: ContractInteractor,
  currentUserAddress: string | null,
  isRegistered: boolean
) {
  container.innerHTML = `
    <div class="p-4" id="referrals-content">
      <h2 class="text-2xl font-bold mb-4">My Referrals</h2>
      
      ${!currentUserAddress ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <p class="mb-4">Please connect your wallet to view your referrals.</p>
          <button id="referrals-connect-wallet" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Connect Wallet
          </button>
        </div>
      ` : !isRegistered ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-2">You need to register first</h3>
          <p class="mb-4">You need to register before you can have referrals in the MLM network.</p>
          <button id="go-to-register" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Go to Registration
          </button>
        </div>
      ` : `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Your Referral Link</h3>
          <div class="flex items-center">
            <input type="text" id="referral-link-input" class="block p-2 flex-1 rounded-l-md border border-gray-300 text-gray-900 sm:text-sm focus:outline-none" readonly>
            <button id="copy-referral" class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-polygon-purple rounded-r-md border border-polygon-purple hover:bg-polygon-dark focus:outline-none">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
              </svg>
              Copy
            </button>
          </div>
          <p class="mt-2 text-sm text-gray-500">Share this link with potential referrals to earn rewards.</p>
        </div>
        
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Direct Referrals</h3>
          <div class="overflow-x-auto" id="direct-referrals-container">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3">Address</th>
                  <th scope="col" class="px-6 py-3">Level</th>
                  <th scope="col" class="px-6 py-3">Joined</th>
                  <th scope="col" class="px-6 py-3">Their Referrals</th>
                </tr>
              </thead>
              <tbody id="direct-referrals-table">
                <tr>
                  <td colspan="4" class="px-6 py-4 text-center">Loading referral data...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Referral Statistics</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div class="text-gray-500 text-sm">Total Referrals</div>
              <div class="text-2xl font-bold text-gray-900" id="total-referrals-count">...</div>
            </div>
            <div class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div class="text-gray-500 text-sm">Referral Earnings</div>
              <div class="text-2xl font-bold text-gray-900" id="referral-earnings">...</div>
            </div>
            <div class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div class="text-gray-500 text-sm">Active Downline</div>
              <div class="text-2xl font-bold text-gray-900" id="active-downline">...</div>
            </div>
            <div class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div class="text-gray-500 text-sm">Overflow Received</div>
              <div class="text-2xl font-bold text-gray-900" id="overflow-received">...</div>
            </div>
          </div>
        </div>
      `}
    </div>
  `;

  // Connect wallet button
  const connectWalletBtn = document.getElementById("referrals-connect-wallet");
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", async () => {
      currentUserAddress = await contractInteractor.connectWallet();
      if (currentUserAddress) {
        const userDetails = await contractInteractor.getUserDetails(currentUserAddress);
        isRegistered = userDetails?.registered || false;
        loadReferralsPage(container, contractInteractor, currentUserAddress, isRegistered);
      }
    });
  }

  // Go to register button
  const goToRegisterBtn = document.getElementById("go-to-register");
  if (goToRegisterBtn) {
    goToRegisterBtn.addEventListener("click", () => {
      localStorage.setItem("activePage", "register");
      window.dispatchEvent(new Event("navigate"));
    });
  }

  // If user is registered, load referral data
  if (isRegistered && currentUserAddress) {
    await loadReferralData(contractInteractor, currentUserAddress);
    setupReferralActions(contractInteractor, currentUserAddress);
  }
}

async function loadReferralData(contractInteractor: ContractInteractor, userAddress: string) {
  try {
    // Set up referral link
    const referralLinkInput = document.getElementById("referral-link-input") as HTMLInputElement;
    if (referralLinkInput) {
      referralLinkInput.value = `${window.location.origin}${window.location.pathname}?ref=${userAddress}`;
    }
    
    // Load direct referrals
    const directReferrals = await contractInteractor.getDirectReferrals(userAddress);
    const referralsTable = document.getElementById("direct-referrals-table");
    
    if (referralsTable) {
      if (directReferrals.length === 0) {
        referralsTable.innerHTML = `
          <tr>
            <td colspan="4" class="px-6 py-4 text-center">You don't have any direct referrals yet.</td>
          </tr>
        `;
      } else {
        referralsTable.innerHTML = "";
        
        for (const referral of directReferrals) {
          const userDetails = await contractInteractor.getUserDetails(referral);
          if (!userDetails) continue;
          
          const referralReferrals = await contractInteractor.getDirectReferrals(referral);
          const joinedDate = new Date(userDetails.registrationTime * 1000);
          
          const row = document.createElement("tr");
          row.className = "bg-white border-b";
          
          row.innerHTML = `
            <td class="px-6 py-4 font-medium text-gray-900">${await contractInteractor.getShortenedAddress(referral)}</td>
            <td class="px-6 py-4">${userDetails.currentLevel}</td>
            <td class="px-6 py-4">${joinedDate.toLocaleDateString()}</td>
            <td class="px-6 py-4">${referralReferrals.length}</td>
          `;
          
          referralsTable.appendChild(row);
        }
      }
    }
    
    // Update statistics with real data from the contract
    const totalReferralsElement = document.getElementById("total-referrals-count");
    if (totalReferralsElement) {
      totalReferralsElement.textContent = directReferrals.length.toString();
    }
    
    // Calculate total referral earnings from all levels
    let totalReferralEarnings = BigInt(0);
    for (let level = 1; level <= 8; level++) {
      const earnings = await contractInteractor.getUserLevelEarnings(userAddress, level);
      if (earnings) {
        totalReferralEarnings += earnings.earningsForLevel;
      }
    }
    
    const referralEarningsElement = document.getElementById("referral-earnings");
    if (referralEarningsElement) {
      referralEarningsElement.textContent = `${ethers.formatEther(totalReferralEarnings)} POL`;
    }
    
    // Calculate active downline count by checking all direct referrals and their referrals
    let activeDownlineCount = 0;
    let processedAddresses = new Set<string>();
    
    // Process direct referrals
    for (const referral of directReferrals) {
      if (processedAddresses.has(referral.toLowerCase())) continue;
      processedAddresses.add(referral.toLowerCase());
      
      const userDetails = await contractInteractor.getUserDetails(referral);
      if (userDetails && userDetails.registered) {
        activeDownlineCount++;
      }
      
      // Add their referrals too (expanding to two levels)
      const secondLevelReferrals = await contractInteractor.getDirectReferrals(referral);
      for (const secondRef of secondLevelReferrals) {
        if (processedAddresses.has(secondRef.toLowerCase())) continue;
        processedAddresses.add(secondRef.toLowerCase());
        
        const secUserDetails = await contractInteractor.getUserDetails(secondRef);
        if (secUserDetails && secUserDetails.registered) {
          activeDownlineCount++;
        }
      }
    }
    
    const activeDownlineElement = document.getElementById("active-downline");
    if (activeDownlineElement) {
      activeDownlineElement.textContent = activeDownlineCount.toString();
    }
    
    // Calculate overflow received by checking payment events
    // This might require additional methods in contractInteractor
    try {
      const userEvents = await contractInteractor.getUserEvents(userAddress);
      const overflowCount = userEvents.filter(event => 
        event.type === 'payment' && 
        !directReferrals.some(ref => 
          ref.toLowerCase() === event.args?.[1].toLowerCase()
        )
      ).length;
      
      const overflowReceivedElement = document.getElementById("overflow-received");
      if (overflowReceivedElement) {
        overflowReceivedElement.textContent = overflowCount.toString();
      }
    } catch (eventError) {
      console.error("Error loading events:", eventError);
      const overflowReceivedElement = document.getElementById("overflow-received");
      if (overflowReceivedElement) {
        overflowReceivedElement.textContent = "N/A";
      }
    }
    
  } catch (error) {
    console.error("Error loading referral data:", error);
  }
}

function setupReferralActions(contractInteractor: ContractInteractor, userAddress: string) {
  const copyReferralBtn = document.getElementById("copy-referral");
  if (copyReferralBtn) {
    copyReferralBtn.addEventListener("click", () => {
      const referralLink = document.getElementById("referral-link-input") as HTMLInputElement;
      
      // Copy to clipboard using the function
      copyToClipboard(
        referralLink.value, 
        copyReferralBtn, 
        `<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
        </svg>
        Copy`,
        "Copied!"
      );
    });
  }
  
  // Add a refresh button to the page if it doesn't exist yet
  const referralsContent = document.getElementById("referrals-content");
  if (referralsContent) {
    let refreshBtn = document.getElementById("refresh-referrals");
    if (!refreshBtn) {
      refreshBtn = document.createElement("button");
      refreshBtn.id = "refresh-referrals";
      refreshBtn.className = "px-4 py-2 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300";
      refreshBtn.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Refresh Referrals
      `;
      referralsContent.appendChild(refreshBtn);
    }
    
    refreshBtn.addEventListener("click", async () => {
      const container = document.getElementById("referrals-content")?.parentElement;
      if (container) {
        await loadReferralsPage(container, contractInteractor, userAddress, true);
      }
    });
  }
}

// Helper function to copy text to clipboard
function copyToClipboard(text: string, button: HTMLElement, originalContent: string, successText: string = "Copied!"): void {
  try {
    navigator.clipboard.writeText(text);
    
    // Show success message
    button.textContent = successText;
    
    // Reset button after 2 seconds
    setTimeout(() => {
      button.innerHTML = originalContent;
    }, 2000);
  } catch (err) {
    console.error("Faild to copy:", err);
    alert("Failed to copy to clipboard");
  }
}

// Add support for handling getUserEvents if it doesn't exist in the ContractInteractor
// This is a fallback implementation in case it's not defined
if (typeof ContractInteractor.prototype.getUserEvents === 'undefined') {
  // This would typically be added to the ContractInteractor class directly,
  // but since we can't modify it here, we'll add a note about implementing it
  console.warn("ContractInteractor.getUserEvents() is not implemented. Overflow calculations will not work correctly.");
}
