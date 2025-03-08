import { ContractInteractor } from "../contract-interactions";
import { ethers } from "ethers";

export async function loadDashboard(
  container: HTMLElement,
  contractInteractor: ContractInteractor,
  currentUserAddress: string | null,
  isRegistered: boolean
) {
  // Basic layout for all states
  container.innerHTML = `
    <div class="p-4" id="dashboard-content">
      <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
      
      ${!currentUserAddress ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Welcome to Polygon MLM Network</h3>
          <p class="mb-4">Connect your wallet to view your dashboard and start earning with our MLM system.</p>
          <button id="dashboard-connect-wallet" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Connect Wallet
          </button>
        </div>
      ` : !isRegistered ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Complete Your Registration</h3>
          <p class="mb-4">Your wallet is connected, but you're not registered in the MLM system yet.</p>
          <p class="mb-4">Register now to start earning!</p>
          <button id="go-to-register" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Register Now
          </button>
        </div>
      ` : `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Your Stats</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4" id="stats-container">
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div class="text-blue-800 text-xl font-bold" id="current-level">...</div>
              <div class="text-sm text-gray-600">Current Level</div>
            </div>
            <div class="p-4 bg-green-50 rounded-lg border border-green-100">
              <div class="text-green-800 text-xl font-bold" id="total-earnings">...</div>
              <div class="text-sm text-gray-600">Total Earnings</div>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div class="text-purple-800 text-xl font-bold" id="direct-referrals">...</div>
              <div class="text-sm text-gray-600">Direct Referrals</div>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div class="text-yellow-800 text-xl font-bold" id="member-since">...</div>
              <div class="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-white rounded-lg shadow">
              <h3 class="text-xl font-bold mb-4">Quick Actions</h3>
              <div class="space-y-2">
                <button id="copy-referral-link" class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                  </svg>
                  Copy Referral Link
                </button>
                <button id="dash-buy-next-level" class="w-full px-4 py-2 bg-polygon-purple hover:bg-polygon-dark text-white rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-polygon-light">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path>
                  </svg>
                  Buy Next Level
                </button>
                <button id="dash-view-referrals" class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.660.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                  </svg>
                  View My Network
                </button>
              </div>
            </div>
            
            <div class="p-6 bg-white rounded-lg shadow">
              <h3 class="text-xl font-bold mb-4">Latest Activity</h3>
              <div id="latest-activity" class="space-y-3">
                <div class="p-3 bg-gray-50 rounded-lg text-sm">
                  <div class="text-gray-700">Loading activity...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Referral Status</h3>
          <div class="overflow-x-auto mb-4">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3">Level</th>
                  <th scope="col" class="px-6 py-3">Status</th>
                  <th scope="col" class="px-6 py-3">Earnings</th>
                  <th scope="col" class="px-6 py-3">Referrals</th>
                </tr>
              </thead>
              <tbody id="levels-summary">
                <tr>
                  <td colspan="4" class="px-6 py-4 text-center">Loading level data...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `}
    </div>
  `;

  // Connect wallet button
  const connectWalletBtn = document.getElementById("dashboard-connect-wallet");
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", async () => {
      currentUserAddress = await contractInteractor.connectWallet();
      if (currentUserAddress) {
        const userDetails = await contractInteractor.getUserDetails(currentUserAddress);
        isRegistered = userDetails?.registered || false;
        loadDashboard(container, contractInteractor, currentUserAddress, isRegistered);
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

  // If user is registered, load user data
  if (currentUserAddress && isRegistered) {
    await loadUserData(contractInteractor, currentUserAddress);
    setupDashboardInteractions(contractInteractor, currentUserAddress);
  }
}

async function loadUserData(contractInteractor: ContractInteractor, userAddress: string) {
  try {
    // Get user details
    const userDetails = await contractInteractor.getUserDetails(userAddress);
    if (!userDetails) return;
    
    // Update current level
    const currentLevelEl = document.getElementById("current-level");
    if (currentLevelEl) {
      currentLevelEl.textContent = userDetails.currentLevel.toString();
    }
    
    // Update total earnings
    const totalEarningsEl = document.getElementById("total-earnings");
    if (totalEarningsEl) {
      totalEarningsEl.textContent = ethers.formatEther(userDetails.totalEarnings) + " POL";
    }
    
    // Update direct referrals
    const directReferralsEl = document.getElementById("direct-referrals");
    if (directReferralsEl) {
      directReferralsEl.textContent = userDetails.directReferralsCount.toString();
    }
    
    // Update member since date
    const memberSinceEl = document.getElementById("member-since");
    if (memberSinceEl) {
      const date = new Date(userDetails.registrationTime * 1000);
      memberSinceEl.textContent = date.toLocaleDateString();
    }
    
    // Update levels summary
    const levelsSummaryEl = document.getElementById("levels-summary");
    if (levelsSummaryEl) {
      levelsSummaryEl.innerHTML = "";
      
      for (let level = 1; level <= 8; level++) {
        const isActive = await contractInteractor.isLevelActive(userAddress, level);
        const levelEarnings = await contractInteractor.getUserLevelEarnings(userAddress, level);
        
        const row = document.createElement("tr");
        row.className = isActive ? "bg-green-50" : "bg-white";
        
        row.innerHTML = `
          <td class="px-6 py-4 font-medium ${isActive ? 'text-green-800' : 'text-gray-900'}">Level ${level}</td>
          <td class="px-6 py-4">
            ${isActive 
              ? '<span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Active</span>' 
              : level === userDetails.currentLevel + 1
                ? '<span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Available</span>'
                : '<span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Locked</span>'
            }
          </td>
          <td class="px-6 py-4">${levelEarnings ? ethers.formatEther(levelEarnings.earningsForLevel) : '0'} POL</td>
          <td class="px-6 py-4">${levelEarnings ? levelEarnings.referralCountForLevel : '0'}</td>
        `;
        
        levelsSummaryEl.appendChild(row);
      }
    }
    
    // Get real activity from blockchain events
    const latestActivityEl = document.getElementById("latest-activity");
    if (latestActivityEl) {
      latestActivityEl.innerHTML = `<div class="p-3 bg-gray-50 rounded-lg text-sm"><div class="text-gray-700">Loading activity...</div></div>`;
      
      try {
        // Get user's referrals
        const directReferrals = await contractInteractor.getDirectReferrals(userAddress);
        
        // Get level earnings for real earnings data
        const activities = [];
        
        // Add referral activities
        if (directReferrals && directReferrals.length > 0) {
          for (let i = 0; i < Math.min(directReferrals.length, 3); i++) {
            const referralAddress = await contractInteractor.getShortenedAddress(directReferrals[i]);
            const referralDetails = await contractInteractor.getUserDetails(directReferrals[i]);
            if (referralDetails) {
              const registrationDate = new Date(referralDetails.registrationTime * 1000);
              activities.push({
                type: "registration",
                address: referralAddress,
                time: getTimeSince(registrationDate)
              });
            }
          }
        }
        
        // Add level purchase activities based on current level
        if (userDetails.currentLevel > 1) {
          for (let level = 2; level <= userDetails.currentLevel; level++) {
            // We don't have the exact time of level purchase, so we estimate
            const estimatedTime = new Date();
            estimatedTime.setDate(estimatedTime.getDate() - (level * 2)); // Mock time - newer levels are more recent
            
            activities.push({
              type: "level_purchase",
              level: level,
              time: getTimeSince(estimatedTime)
            });
          }
        }
        
        // Add earnings activities - get real earnings data
        for (let level = 1; level <= userDetails.currentLevel; level++) {
          const levelEarnings = await contractInteractor.getUserLevelEarnings(userAddress, level);
          if (levelEarnings && levelEarnings.earningsForLevel > BigInt(0)) {
            activities.push({
              type: "earning",
              amount: ethers.formatEther(levelEarnings.earningsForLevel),
              level: level,
              time: "from level " + level
            });
          }
        }
        
        // Sort by assumed recency (this could be improved with real timestamps)
        // activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        
        // If we got activities, display them
        if (activities.length > 0) {
          latestActivityEl.innerHTML = "";
          
          activities.slice(0, 5).forEach(activity => {
            const activityEl = document.createElement("div");
            activityEl.className = "p-3 bg-gray-50 rounded-lg text-sm mb-2";
            
            switch (activity.type) {
              case "registration":
                activityEl.innerHTML = `
                  <div class="text-gray-700">Referral registered: <span class="font-medium">${activity.address}</span></div>
                  <div class="text-gray-500 text-xs">${activity.time}</div>
                `;
                break;
              case "level_purchase":
                activityEl.innerHTML = `
                  <div class="text-gray-700">You upgraded to Level ${activity.level}</div>
                  <div class="text-gray-500 text-xs">${activity.time}</div>
                `;
                break;
              case "earning":
                activityEl.innerHTML = `
                  <div class="text-gray-700">You earned <span class="font-medium">${activity.amount} POL</span></div>
                  <div class="text-gray-500 text-xs">${activity.time}</div>
                `;
                break;
            }
            
            latestActivityEl.appendChild(activityEl);
          });
        } else {
          latestActivityEl.innerHTML = `
            <div class="p-3 bg-gray-50 rounded-lg text-sm">
              <div class="text-gray-700">No activity found yet. Start inviting referrals to see activity!</div>
            </div>
          `;
        }
      } catch (activityError) {
        console.error("Error loading activity:", activityError);
        latestActivityEl.innerHTML = `
          <div class="p-3 bg-gray-50 rounded-lg text-sm">
            <div class="text-gray-700">Could not load activity data. Please try again later.</div>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Helper function to get time since a date in human-readable format
function getTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + (interval === 1 ? " year" : " years") + " ago";
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + (interval === 1 ? " month" : " months") + " ago";
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + (interval === 1 ? " day" : " days") + " ago";
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + (interval === 1 ? " hour" : " hours") + " ago";
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + (interval === 1 ? " minute" : " minutes") + " ago";
  }
  
  return Math.floor(seconds) + " seconds ago";
}

function setupDashboardInteractions(contractInteractor: ContractInteractor, userAddress: string) {
  // Copy referral link button
  const copyReferralLinkBtn = document.getElementById("copy-referral-link");
  if (copyReferralLinkBtn) {
    copyReferralLinkBtn.addEventListener("click", () => {
      try {
        // Create a referral link with the user's address
        const referralLink = `${window.location.origin}${window.location.pathname}?ref=${userAddress}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(referralLink);
        
        // Show success message
        copyReferralLinkBtn.textContent = "Copied!";
        setTimeout(() => {
          copyReferralLinkBtn.innerHTML = `
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
            </svg>
            Copy Referral Link
          `;
        }, 2000);
      } catch (error) {
        console.error("Failed to copy referral link:", error);
        alert("Failed to copy referral link. Please try again.");
      }
    });
  }
  
  // Buy next level button
  const buyNextLevelBtn = document.getElementById("dash-buy-next-level");
  if (buyNextLevelBtn) {
    buyNextLevelBtn.addEventListener("click", async () => {
      try {
        // Get user details to determine next level
        const userDetails = await contractInteractor.getUserDetails(userAddress);
        if (userDetails) {
          const nextLevel = userDetails.currentLevel + 1;
          if (nextLevel <= 8) { // Assuming 8 is the maximum level
            // Check if the contract interaction method exists before navigating
            if (contractInteractor.buyLevel) {
              // Option 1: Direct contract interaction from dashboard
              const confirm = window.confirm(`Are you sure you want to purchase Level ${nextLevel}?`);
              if (confirm) {
                await contractInteractor.buyLevel(nextLevel);
                // Refresh dashboard after level purchase
                const container = document.getElementById("dashboard-content")?.parentElement;
                if (container) {
                  loadDashboard(container, contractInteractor, userAddress, true);
                }
                return;
              }
            }
          }
        }
        // If direct interaction not available or user canceled, navigate to levels page
        localStorage.setItem("activePage", "levels");
        window.dispatchEvent(new Event("navigate"));
      } catch (error) {
        console.error("Error handling level purchase:", error);
        localStorage.setItem("activePage", "levels");
        window.dispatchEvent(new Event("navigate"));
      }
    });
  }
  
  // View referrals button
  const viewReferralsBtn = document.getElementById("dash-view-referrals");
  if (viewReferralsBtn) {
    viewReferralsBtn.addEventListener("click", () => {
      localStorage.setItem("activePage", "referrals");
      window.dispatchEvent(new Event("navigate"));
    });
  }
}
