import { ContractInteractor } from "../contract-interactions";
import { ethers } from "ethers";
import { initNetworkGrowthChart, isChartLibraryLoaded } from "../components/chart-utils";

// No need for the module declaration anymore since we've added the methods directly to the class

export async function loadAdminPage(
  container: HTMLElement,
  contractInteractor: ContractInteractor,
  currentUserAddress: string | null
) {
  // Add debugging to see if the function is being called
  console.log("Admin page loading attempt", { currentUserAddress });
  
  // First check if current user is the contract owner
  let isOwner = false;
  
  try {
    if (currentUserAddress) {
      const ownerAddress = await contractInteractor.getOwner();
      console.log("Owner check:", { 
        userAddress: currentUserAddress, 
        ownerAddress: ownerAddress,
        isMatch: currentUserAddress.toLowerCase() === ownerAddress.toLowerCase()
      });
      isOwner = currentUserAddress.toLowerCase() === ownerAddress.toLowerCase();
    }
  } catch (error) {
    console.error("Error checking owner status:", error);
  }
  
  // Basic layout based on connection and owner status
  container.innerHTML = `
    <div class="p-4" id="admin-content">
      <h2 class="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      ${!currentUserAddress ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Access Required</h3>
          <p class="mb-4">Please connect your wallet to access admin functions.</p>
          <button id="admin-connect-wallet" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Connect Wallet
          </button>
        </div>
      ` : !isOwner ? `
        <div class="mb-6 p-6 bg-white rounded-lg border-l-4 border-red-500 shadow">
          <h3 class="text-xl font-bold mb-2 text-red-700">Access Denied</h3>
          <p class="mb-4">Only the contract owner can access the admin dashboard.</p>
          <p class="text-sm text-gray-600">Your address: ${await contractInteractor.getShortenedAddress(currentUserAddress)}</p>
        </div>
      ` : `
        <div class="mb-6 p-6 bg-white rounded-lg border-l-4 border-green-500 shadow">
          <h3 class="text-xl font-bold mb-2 text-green-700">Welcome, Admin</h3>
          <p class="mb-4">You have full access to admin functions.</p>
          <p class="text-sm text-gray-600">Contract owner: ${await contractInteractor.getShortenedAddress(currentUserAddress)}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-xl font-bold mb-4">Contract Statistics</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center border-b pb-2">
                <span class="text-gray-600">Total Registered Users:</span>
                <span class="font-bold" id="total-users">Loading...</span>
              </div>
              <div class="flex justify-between items-center border-b pb-2">
                <span class="text-gray-600">Contract Balance:</span>
                <span class="font-bold" id="contract-balance">Loading...</span>
              </div>
              <div class="flex justify-between items-center border-b pb-2">
                <span class="text-gray-600">Total Transactions:</span>
                <span class="font-bold" id="total-transactions">Loading...</span>
              </div>
              <button id="refresh-stats" class="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none">
                Refresh Statistics
              </button>
            </div>
          </div>
          
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-xl font-bold mb-4">Admin Actions</h3>
            <div class="space-y-4">
              <div>
                <label for="new-owner" class="block mb-2 text-sm font-medium text-gray-700">Transfer Ownership</label>
                <div class="flex">
                  <input type="text" id="new-owner" class="block p-2.5 w-full text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-polygon-purple focus:border-polygon-purple" placeholder="New owner address">
                  <button id="transfer-ownership" class="px-4 py-2 bg-polygon-purple text-white rounded-r-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
                    Transfer
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500">Warning: This action cannot be undone!</p>
              </div>
              
              <div class="pt-4 border-t">
                <label class="block mb-2 text-sm font-medium text-gray-700">Emergency Withdrawal</label>
                <button id="emergency-withdraw" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                  Withdraw Contract Balance
                </button>
                <p class="mt-1 text-xs text-gray-500">Withdraws any POL accidentally sent to the contract.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Recent Registrations</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3">User</th>
                  <th scope="col" class="px-6 py-3">Upline</th>
                  <th scope="col" class="px-6 py-3">Time</th>
                  <th scope="col" class="px-6 py-3">Level</th>
                </tr>
              </thead>
              <tbody id="recent-registrations">
                <tr>
                  <td colspan="4" class="px-6 py-4 text-center">Loading recent registrations...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
       
      `}
    </div>
  `;

  // Connect wallet button for non-connected users
  const connectWalletBtn = document.getElementById("admin-connect-wallet");
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", async () => {
      currentUserAddress = await contractInteractor.connectWallet();
      if (currentUserAddress) {
        loadAdminPage(container, contractInteractor, currentUserAddress);
      }
    });
  }
  
  // If user is owner, load admin functionality
  if (currentUserAddress && isOwner) {
    await loadAdminData(contractInteractor);
    setupAdminActions(contractInteractor);
  }
}

async function loadAdminData(contractInteractor: ContractInteractor) {
  try {
    // Load total users
    const totalUsersEl = document.getElementById("total-users");
    if (totalUsersEl) {
      const totalUsers = await contractInteractor.getTotalUsers();
      totalUsersEl.textContent = totalUsers.toString();
    }
    
    // Load contract balance
    const contractBalanceEl = document.getElementById("contract-balance");
    if (contractBalanceEl) {
      try {
        const balance = await contractInteractor.getContractBalance();
        contractBalanceEl.textContent = `${ethers.formatEther(balance)} POL`;
      } catch (error) {
        console.error("Could not get contract balance:", error);
        contractBalanceEl.textContent = "N/A";
      }
    }
    
    // Load transaction count
    const totalTransactionsEl = document.getElementById("total-transactions");
    if (totalTransactionsEl) {
      try {
        const transactionCount = await contractInteractor.getTransactionCount();
        totalTransactionsEl.textContent = transactionCount.toString();
      } catch (error) {
        console.error("Could not get transaction count:", error);
        totalTransactionsEl.textContent = "N/A";
      }
    }
    
    // Load recent registrations
    const recentRegistrationsEl = document.getElementById("recent-registrations");
    if (recentRegistrationsEl) {
      try {
        const registrationEvents = await contractInteractor.getRegistrationEvents(10);
        
        if (registrationEvents && registrationEvents.length > 0) {
          recentRegistrationsEl.innerHTML = "";
          
          for (const event of registrationEvents) {
            const row = document.createElement("tr");
            row.className = "bg-white border-b";
            
            const userAddress = event.args?.[0] || "Unknown";
            const uplineAddress = event.args?.[1] || "Unknown";
            const timestamp = event.args?.[2] ? new Date(Number(event.args[2]) * 1000) : new Date();
            
            row.innerHTML = `
              <td class="px-6 py-4">${await contractInteractor.getShortenedAddress(userAddress)}</td>
              <td class="px-6 py-4">${await contractInteractor.getShortenedAddress(uplineAddress)}</td>
              <td class="px-6 py-4">${timestamp.toLocaleString()}</td>
              <td class="px-6 py-4">1</td>
            `;
            
            recentRegistrationsEl.appendChild(row);
          }
        } else {
          recentRegistrationsEl.innerHTML = `
            <tr>
              <td colspan="4" class="px-6 py-4 text-center">No registration events found.</td>
            </tr>
          `;
        }
      } catch (error) {
        console.error("Error loading registration events:", error);
        recentRegistrationsEl.innerHTML = `
          <tr>
            <td colspan="4" class="px-6 py-4 text-center">Error loading registration events.</td>
          </tr>
        `;
      }
    }
    
    // Initialize network growth chart
    const chartContainer = document.getElementById("network-growth-chart")?.parentElement;
    
    if (!isChartLibraryLoaded()) {
      if (chartContainer) {
        chartContainer.innerHTML = `
          <div class="p-4 bg-gray-50 rounded-lg text-center">
            <p>Chart library not loaded. Please refresh the page or check your internet connection.</p>
          </div>
        `;
      }
    } else {
      try {
        // Get registration data grouped by day
        const registrationData = await contractInteractor.getRegistrationsByDate();
        
        // Initialize the chart with our utility function
        initNetworkGrowthChart(
          "network-growth-chart", 
          registrationData.dates, 
          registrationData.counts
        );
      } catch (error) {
        console.error("Error loading registration data for chart:", error);
        if (chartContainer) {
          chartContainer.innerHTML = `
            <div class="p-4 bg-gray-50 rounded-lg text-center">
              <p>Could not load chart data. Please try again later.</p>
            </div>
          `;
        }
      }
    }
  } catch (error) {
    console.error("Error loading admin data:", error);
  }
}

function setupAdminActions(contractInteractor: ContractInteractor) {
  // Refresh stats button
  const refreshStatsBtn = document.getElementById("refresh-stats");
  if (refreshStatsBtn) {
    refreshStatsBtn.addEventListener("click", async () => {
      await loadAdminData(contractInteractor);
    });
  }
  
  // Transfer ownership
  const transferOwnershipBtn = document.getElementById("transfer-ownership");
  const newOwnerInput = document.getElementById("new-owner") as HTMLInputElement;
  
  if (transferOwnershipBtn && newOwnerInput) {
    transferOwnershipBtn.addEventListener("click", async () => {
      const newOwnerAddress = newOwnerInput.value.trim();
      if (!ethers.isAddress(newOwnerAddress)) {
        alert("Please enter a valid Ethereum address");
        return;
      }
      
      const confirmed = confirm(`Are you sure you want to transfer ownership to ${newOwnerAddress}? This action cannot be undone!`);
      
      if (confirmed) {
        try {
          const success = await contractInteractor.transferOwnership(newOwnerAddress);
          
          if (success) {
            alert("Ownership transferred successfully!");
            
            // Refresh the page after ownership transfer
            const container = document.getElementById("admin-content")?.parentElement;
            if (container) {
              const currentUserAddress = await contractInteractor.getCurrentWalletAddress();
              loadAdminPage(container, contractInteractor, currentUserAddress);
            }
          } else {
            alert("Ownership transfer failed. Please try again.");
          }
        } catch (error) {
          console.error("Error transferring ownership:", error);
          alert("Error transferring ownership. Check console for details.");
        }
      }
    });
  }
  
  // Emergency withdraw
  const emergencyWithdrawBtn = document.getElementById("emergency-withdraw");
  if (emergencyWithdrawBtn) {
    emergencyWithdrawBtn.addEventListener("click", async () => {
      try {
        const contractBalance = await contractInteractor.getContractBalance();
        
        if (contractBalance <= BigInt(0)) {
          alert("Contract balance is zero. Nothing to withdraw.");
          return;
        }
        
        const formattedBalance = ethers.formatEther(contractBalance);
        const confirmed = confirm(`Are you sure you want to withdraw ${formattedBalance} POL from the contract?`);
        
        if (confirmed) {
          const success = await contractInteractor.emergencyWithdraw();
          
          if (success) {
            alert("Funds withdrawn successfully!");
            // Refresh data after withdrawal
            await loadAdminData(contractInteractor);
          } else {
            alert("Withdrawal failed. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error with withdrawal process:", error);
        alert("Error with withdrawal process. Check console for details.");
      }
    });
  }
}
