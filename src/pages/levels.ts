import { ContractInteractor } from "../contract-interactions";
import { ethers } from "ethers";

export async function loadLevelsPage(
  container: HTMLElement,
  contractInteractor: ContractInteractor,
  currentUserAddress: string | null,
  isRegistered: boolean
) {
  container.innerHTML = `
    <div class="p-4" id="levels-content">
      <h2 class="text-2xl font-bold mb-4">Buy Levels</h2>
      
      ${!currentUserAddress ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <p class="mb-4">Please connect your wallet to view and buy levels.</p>
          <button id="levels-connect-wallet" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Connect Wallet
          </button>
        </div>
      ` : !isRegistered ? `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-2">You need to register first</h3>
          <p class="mb-4">You need to register before you can buy levels in the MLM network.</p>
          <button id="go-to-register" class="px-4 py-2 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Go to Registration
          </button>
        </div>
      ` : `
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Your Level Status</h3>
          <div id="level-status-container" class="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1 text-center">
              <div class="text-gray-500 text-sm">Current Level</div>
              <div class="text-3xl font-bold text-polygon-purple" id="current-level-display">...</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1 text-center">
              <div class="text-gray-500 text-sm">Next Level</div>
              <div class="text-3xl font-bold text-polygon-dark" id="next-level-display">...</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1 text-center">
              <div class="text-gray-500 text-sm">Cost to Upgrade</div>
              <div class="text-3xl font-bold text-polygon-dark" id="upgrade-cost-display">...</div>
            </div>
          </div>
          
          <div class="flex justify-center mt-6">
            <button id="buy-next-level" class="px-6 py-3 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light text-lg font-bold disabled:opacity-50" disabled>
              Buy Next Level
            </button>
          </div>
        </div>
        
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">All Levels</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3">Level</th>
                  <th scope="col" class="px-6 py-3">Price</th>
                  <th scope="col" class="px-6 py-3">Potential Earnings</th>
                  <th scope="col" class="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody id="levels-table-body">
                <!-- Will be populated by JS -->
                <tr>
                  <td colspan="4" class="px-6 py-4 text-center">Loading level data...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">Level Pricing Information</h3>
          <p class="mb-4 text-gray-600">The Polygon MLM system operates with an 8-level structure with the following pricing:</p>
          
          <ul class="space-y-2 text-gray-600">
            <li><span class="font-medium">Level 1:</span> 200 POL (Registration cost)</li>
            <li><span class="font-medium">Level 2:</span> 600 POL</li>
            <li><span class="font-medium">Level 3:</span> 1,800 POL</li>
            <li><span class="font-medium">Level 4:</span> 5,400 POL</li>
            <li><span class="font-medium">Level 5:</span> 16,200 POL</li>
            <li><span class="font-medium">Level 6:</span> 48,600 POL</li>
            <li><span class="font-medium">Level 7:</span> 145,800 POL</li>
            <li><span class="font-medium">Level 8:</span> 437,400 POL</li>
          </ul>
          
          <div class="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg">
            <p><span class="font-bold">Note:</span> Level purchase prices are paid directly to your appropriate upline members. Payments are instant and irreversible.</p>
          </div>
        </div>
      `}
    </div>
  `;

  // Connect wallet button
  const connectWalletBtn = document.getElementById("levels-connect-wallet");
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", async () => {
      currentUserAddress = await contractInteractor.connectWallet();
      if (currentUserAddress) {
        const userDetails = await contractInteractor.getUserDetails(currentUserAddress);
        isRegistered = userDetails?.registered || false;
        loadLevelsPage(container, contractInteractor, currentUserAddress, isRegistered);
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

  // If user is registered, load level data
  if (isRegistered && currentUserAddress) {
    await loadLevelData(contractInteractor, currentUserAddress);
    setupLevelInteractions(contractInteractor, currentUserAddress);
  }
}

async function loadLevelData(contractInteractor: ContractInteractor, userAddress: string) {
  try {
    const userDetails = await contractInteractor.getUserDetails(userAddress);
    if (!userDetails) return;

    // Update current level display
    const currentLevelEl = document.getElementById("current-level-display");
    if (currentLevelEl) {
      currentLevelEl.textContent = userDetails.currentLevel.toString();
    }

    // Update next level display
    const nextLevel = userDetails.currentLevel < 8 ? userDetails.currentLevel + 1 : "Max";
    const nextLevelEl = document.getElementById("next-level-display");
    if (nextLevelEl) {
      nextLevelEl.textContent = nextLevel.toString();
    }

    // Update upgrade cost display
    const upgradeCostEl = document.getElementById("upgrade-cost-display");
    if (upgradeCostEl) {
      if (userDetails.currentLevel < 8) {
        const nextLevelPrice = await contractInteractor.getLevelPrice(nextLevel as number);
        upgradeCostEl.textContent = ethers.formatEther(nextLevelPrice) + " POL";
      } else {
        upgradeCostEl.textContent = "N/A";
      }
    }

    // Enable/disable buy button
    const buyButton = document.getElementById("buy-next-level") as HTMLButtonElement;
    if (buyButton) {
      if (userDetails.currentLevel < 8) {
        buyButton.disabled = false;
      } else {
        buyButton.disabled = true;
        buyButton.textContent = "Maximum Level Reached";
      }
    }

    // Populate levels table
    const tableBody = document.getElementById("levels-table-body");
    if (tableBody) {
      tableBody.innerHTML = "";

      // Level price multipliers (relative to referrals)
      const referralMultipliers = [3, 9, 27, 81, 243, 729, 2187, 6561];

      for (let level = 1; level <= 8; level++) {
        const isActive = await contractInteractor.isLevelActive(userAddress, level);
        const levelPrice = await contractInteractor.getLevelPrice(level);
        const formattedPrice = ethers.formatEther(levelPrice);

        const potentialEarnings = level === 8 ? "N/A" : ethers.formatEther(levelPrice * BigInt(referralMultipliers[level - 1]));

        const row = document.createElement("tr");
        row.className = isActive ? "bg-green-50" : level === userDetails.currentLevel + 1 ? "bg-yellow-50" : "bg-white";

        row.innerHTML = `
          <td class="px-6 py-4 font-medium ${isActive ? 'text-green-800' : 'text-gray-900'}">${level}</td>
          <td class="px-6 py-4">${formattedPrice} POL</td>
          <td class="px-6 py-4">${potentialEarnings} POL</td>
          <td class="px-6 py-4">
            ${isActive
            ? '<span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Active</span>'
            : level === userDetails.currentLevel + 1
              ? '<span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Available</span>'
              : '<span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Locked</span>'
          }
          </td>
        `;

        tableBody.appendChild(row);
      }
    }
  } catch (error) {
    console.error("Error loading level data:", error);
  }
}

function setupLevelInteractions(contractInteractor: ContractInteractor, userAddress: string) {
  const buyNextLevelBtn = document.getElementById("buy-next-level");
  if (buyNextLevelBtn) {
    buyNextLevelBtn.addEventListener("click", async () => {
      if (!userAddress) return;

      try {
        // Get user details to determine next level
        const userDetails = await contractInteractor.getUserDetails(userAddress);
        if (!userDetails) return;

        const nextLevel = userDetails.currentLevel + 1;
        if (nextLevel > 8) {
          alert("You've already reached the maximum level!");
          return;
        }

        // Confirm purchase
        if (!confirm(`Are you sure you want to purchase Level ${nextLevel} for ${ethers.formatEther(await contractInteractor.getLevelPrice(nextLevel))} POL?`)) {
          return;
        }

        buyNextLevelBtn.setAttribute("disabled", "true");
        buyNextLevelBtn.textContent = "Processing...";

        // Buy the level
        const success = await contractInteractor.buyLevel(nextLevel);

        if (success) {
          alert(`Successfully purchased Level ${nextLevel}!`);
          loadLevelsPage(document.querySelector("#main-content main") as HTMLElement, contractInteractor, userAddress, true);
        } else {
          alert("Failed to purchase level. Please try again.");
          buyNextLevelBtn.removeAttribute("disabled");
          buyNextLevelBtn.textContent = "Buy Next Level";
        }
      } catch (error) {
        console.error("Error buying level:", error);
        alert("Error buying level: " + (error instanceof Error ? error.message : "Unknown error"));
        buyNextLevelBtn.removeAttribute("disabled");
        buyNextLevelBtn.textContent = "Buy Next Level";
      }
    });
  }
}