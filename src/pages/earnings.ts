import { ContractInteractor } from "../contract-interactions";
import { ethers } from "ethers";

export async function loadEarningsPage(
  container: HTMLElement,
  contractInteractor: ContractInteractor,
  currentUserAddress: string | null,
  isRegistered: boolean
) {
  container.innerHTML = `
    <div class="p-4" id="earnings-content">
      <h2 class="text-2xl font-bold mb-4">My Earnings</h2>
      
      ${!currentUserAddress ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <p class="mb-4">Please connect your wallet to view your earnings.</p>
          <button id="earnings-connect-wallet" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Connect Wallet
          </button>
        </div>
      ` : !isRegistered ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-2">You need to register first</h3>
          <p class="mb-4">You need to register before you can earn in the MLM network.</p>
          <button id="go-to-register" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Go to Registration
          </button>
        </div>
      ` : `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Earnings Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div class="p-4 bg-green-50 rounded-lg border border-green-100">
              <div class="text-green-800 text-xl font-bold" id="total-earnings-display">...</div>
              <div class="text-sm text-gray-600">Total Earnings</div>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div class="text-blue-800 text-xl font-bold" id="current-level-display">...</div>
              <div class="text-sm text-gray-600">Current Level</div>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div class="text-purple-800 text-xl font-bold" id="direct-referrals-display">...</div>
              <div class="text-sm text-gray-600">Direct Referrals</div>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div class="text-yellow-800 text-xl font-bold" id="member-since-display">...</div>
              <div class="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </div>
        
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Earnings by Level</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3">Level</th>
                  <th scope="col" class="px-6 py-3">Status</th>
                  <th scope="col" class="px-6 py-3">Referrals</th>
                  <th scope="col" class="px-6 py-3">Earnings</th>
                </tr>
              </thead>
              <tbody id="level-earnings-table">
                <tr>
                  <td colspan="4" class="px-6 py-4 text-center">Loading earnings data...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Earnings Potential</h3>
          <p class="mb-4 text-gray-600">
            Based on your current level (Level <span id="current-level-text">...</span>), here's your potential earnings if your network grows fully:
          </p>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3">Level</th>
                  <th scope="col" class="px-6 py-3">Max Referrals</th>
                  <th scope="col" class="px-6 py-3">Earnings Per Referral</th>
                  <th scope="col" class="px-6 py-3">Potential Earnings</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b">
                  <td class="px-6 py-4 font-medium">Level 1</td>
                  <td class="px-6 py-4">3</td>
                  <td class="px-6 py-4">200 POL</td>
                  <td class="px-6 py-4">600 POL</td>
                </tr>
                <tr class="bg-gray-50 border-b">
                  <td class="px-6 py-4 font-medium">Level 2</td>
                  <td class="px-6 py-4">9</td>
                  <td class="px-6 py-4">200 POL</td>
                  <td class="px-6 py-4">1,800 POL</td>
                </tr>
                <tr class="bg-white border-b">
                  <td class="px-6 py-4 font-medium">Level 3</td>
                  <td class="px-6 py-4">27</td>
                  <td class="px-6 py-4">200 POL</td>
                  <td class="px-6 py-4">5,400 POL</td>
                </tr>
                <tr class="bg-gray-50 border-b">
                  <td class="px-6 py-4 font-medium">Level 4</td>
                  <td class="px-6 py-4">81</td>
                  <td class="px-6 py-4">200 POL</td>
                  <td class="px-6 py-4">16,200 POL</td>
                </tr>
                <tr class="bg-white border-b">
                  <td class="px-6 py-4 font-medium">Level 5</td>
                  <td class="px-6 py-4">243</td>
                  <td class="px-6 py-4">200 POL</td>
                  <td class="px-6 py-4">48,600 POL</td>
                </tr>
                <tr class="bg-gray-50 border-b">
                  <td class="px-6 py-4 font-medium">Level 6</td>
                  <td class="px-6 py-4">729</td>
                  <td class="px-6 py-4">200 POL</td>
                  <td class="px-6 py-4">145,800 POL</td>
                </tr>
                <tr class="bg-white border-b">
                  <td class="px-6 py-4 font-medium">Level 7</td>
                  <td class="px-6 py-4">2,187</td>
                  <td class="px-6 py-4">200 POL</td>
                  <td class="px-6 py-4">437,400 POL</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="px-6 py-4 font-medium">Level 8</td>
                  <td class="px-6 py-4">6,561</td>
                  <td class="px-6 py-4">200 POL</td>
                  <td class="px-6 py-4">1,312,200 POL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `}
    </div>
  `;

  // Connect wallet button
  const connectWalletBtn = document.getElementById("earnings-connect-wallet");
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", async () => {
      currentUserAddress = await contractInteractor.connectWallet();
      if (currentUserAddress) {
        const userDetails = await contractInteractor.getUserDetails(currentUserAddress);
        isRegistered = userDetails?.registered || false;
        loadEarningsPage(container, contractInteractor, currentUserAddress, isRegistered);
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

  // If user is registered, load earnings data
  if (isRegistered && currentUserAddress) {
    await loadEarningsData(contractInteractor, currentUserAddress);
  }
}

async function loadEarningsData(contractInteractor: ContractInteractor, userAddress: string) {
  try {
    // Get user details
    const userDetails = await contractInteractor.getUserDetails(userAddress);
    if (!userDetails) return;
    
    // Update summary information
    document.getElementById("total-earnings-display")!.textContent = 
      ethers.formatEther(userDetails.totalEarnings) + " POL";
    
    document.getElementById("current-level-display")!.textContent = 
      userDetails.currentLevel.toString();
    
    document.getElementById("direct-referrals-display")!.textContent = 
      userDetails.directReferralsCount.toString();
    
    const date = new Date(userDetails.registrationTime * 1000);
    document.getElementById("member-since-display")!.textContent = 
      date.toLocaleDateString();
      
    document.getElementById("current-level-text")!.textContent =
      userDetails.currentLevel.toString();
    
    // Load level earnings
    const levelEarningsTable = document.getElementById("level-earnings-table");
    if (levelEarningsTable) {
      levelEarningsTable.innerHTML = "";
      
      for (let level = 1; level <= 8; level++) {
        const isActive = await contractInteractor.isLevelActive(userAddress, level);
        const levelEarnings = await contractInteractor.getUserLevelEarnings(userAddress, level);
        
        if (!levelEarnings) continue;
        
        const row = document.createElement("tr");
        row.className = isActive ? "bg-green-50 border-b" : "bg-white border-b";
        
        row.innerHTML = `
          <td class="px-6 py-4 font-medium ${isActive ? 'text-green-800' : 'text-gray-900'}">Level ${level}</td>
          <td class="px-6 py-4">
            ${isActive 
              ? '<span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Active</span>' 
              : '<span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Inactive</span>'
            }
          </td>
          <td class="px-6 py-4">${levelEarnings.referralCountForLevel}</td>
          <td class="px-6 py-4">${ethers.formatEther(levelEarnings.earningsForLevel)} POL</td>
        `;
        
        levelEarningsTable.appendChild(row);
      }
    }
  } catch (error) {
    console.error("Error loading earnings data:", error);
  }
}
