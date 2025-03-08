import "./css/style.css";
import { ContractInteractor } from "./contract-interactions";
import { loadHomePage } from "./pages/home";
import { loadDashboard } from "./pages/dashboard";
import { loadRegisterPage } from "./pages/register";
import { loadLevelsPage } from "./pages/levels";
import { loadReferralsPage } from "./pages/referrals";
import { loadEarningsPage } from "./pages/earnings";
import { loadHowItWorks } from "./pages/how-it-works";
import { loadFAQ } from "./pages/faq";
import { showLoadingOverlay, hideLoadingOverlay } from "./components/loading-overlay";
// Import debug helpers
import "./debug-helpers";

// Create contract interactor instance
const contractInteractor = new ContractInteractor();

// Make it available for debugging
(window as any).contractInteractor = contractInteractor;

// Global state
let currentUserAddress: string | null = null;
let isRegistered = false;

// DOM elements - update wallet related elements
const walletConnectBtn = document.getElementById("wallet-connect") as HTMLButtonElement;
const walletConnectedContainer = document.getElementById("wallet-connected-container") as HTMLDivElement;
const walletConnectedBtn = document.getElementById("wallet-connected") as HTMLButtonElement;
const walletAddressSpan = document.getElementById("wallet-address") as HTMLSpanElement;
const fullWalletAddressEl = document.getElementById("full-wallet-address") as HTMLParagraphElement;
const walletDropdown = document.getElementById("wallet-dropdown") as HTMLDivElement;
const walletCopyAddressBtn = document.getElementById("wallet-copy-address") as HTMLButtonElement;
const walletViewExplorerBtn = document.getElementById("wallet-view-explorer") as HTMLButtonElement;
const walletDisconnectBtn = document.getElementById("wallet-disconnect") as HTMLButtonElement;
const networkSelect = document.getElementById("network-select") as HTMLSelectElement;
const mainContent = document.getElementById("main-content")?.querySelector("main");
const sidebarLinks = document.querySelectorAll("[data-page]");
const toggleSidebarBtn = document.getElementById("toggleSidebarMobile") as HTMLButtonElement;
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

// Initialize the application
async function init() {
  // Check for stored registration status
  const storedRegistered = sessionStorage.getItem('isRegistered');
  if (storedRegistered === 'true') {
    isRegistered = true;
    console.log("Loading from stored registration status: User IS registered");
  }

  // Hide the loading overlay once the app is initialized
  hideLoadingOverlay();
  
  setupEventListeners();
  checkWalletConnection();
  loadActivePage();
  
  // Check if URL has a referral, but store minimal data to avoid quota issues
  const urlParams = new URLSearchParams(window.location.search);
  const referrer = urlParams.get('ref');
  if (referrer && referrer.length < 50) { // Safety check on size
    localStorage.setItem('referrer', referrer);
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Wallet connection
  walletConnectBtn.addEventListener("click", connectWallet);
  
  // Set up wallet dropdown and related functionality
  setupWalletElements();
  
  // Network selection
  networkSelect.addEventListener("change", handleNetworkChange);
  
  // Navigation
  sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      if (page) {
        navigateToPage(page);
      }
    });
  });
  
  // Mobile sidebar toggle
  toggleSidebarBtn.addEventListener("click", toggleSidebar);
  sidebarBackdrop?.addEventListener("click", closeSidebar);
  
  // Listen for Ethereum account changes
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", () => window.location.reload());
  }
  
  // Add a global event listener for navigation
  window.addEventListener("navigate", () => {
    loadActivePage();
  });
}

// Connect to MetaMask wallet
async function connectWallet() {
  try {
    // Show loading overlay while connecting
    showLoadingOverlay("Connecting to wallet...");
    
    currentUserAddress = await contractInteractor.connectWallet();
    
    // Hide loading overlay after connection attempt
    hideLoadingOverlay();
    
    if (currentUserAddress) {
      // Update UI to show connected wallet
      const shortenedAddress = await contractInteractor.getShortenedAddress(currentUserAddress);
      walletAddressSpan.textContent = shortenedAddress;
      fullWalletAddressEl.textContent = currentUserAddress;
      
      // Toggle visibility
      walletConnectBtn.classList.add("hidden");
      walletConnectedContainer.classList.remove("hidden");
      
      await checkUserRegistration();
      console.log("After connection - Registration status:", isRegistered);
      loadActivePage(); // Reload the active page with wallet info
    }
  } catch (error) {
    // Hide loading overlay if there's an error
    hideLoadingOverlay();
    
    console.error("Failed to connect wallet:", error);
    alert("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.");
  }
}

// Check if user is already connected
async function checkWalletConnection() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  } else {
    walletConnectBtn.classList.remove("hidden");
    walletConnectedContainer.classList.add("hidden");
  }
}

// Handle account changes in MetaMask
async function handleAccountsChanged(accounts: string[]) {
  if (accounts.length === 0) {
    // User disconnected their wallet
    disconnectWallet();
  } else if (accounts[0] !== currentUserAddress) {
    // User switched accounts
    currentUserAddress = accounts[0];
    const shortenedAddress = await contractInteractor.getShortenedAddress(currentUserAddress);
    walletAddressSpan.textContent = shortenedAddress;
    fullWalletAddressEl.textContent = currentUserAddress;
    await checkUserRegistration();
    loadActivePage();
  }
}

// Disconnect wallet
function disconnectWallet() {
  contractInteractor.disconnectWallet();
  currentUserAddress = null;
  isRegistered = false;
  
  // Toggle visibility back to connect button
  walletConnectBtn.classList.remove("hidden");
  walletConnectedContainer.classList.add("hidden");
  walletDropdown.classList.add("hidden");
  
  loadActivePage();
}

// Handle network change
async function handleNetworkChange(e: Event) {
  const selectedNetwork = (e.target as HTMLSelectElement).value;
  await contractInteractor.switchNetwork(selectedNetwork);
  if (currentUserAddress) {
    await checkUserRegistration();
  }
  loadActivePage();
}

// Toggle mobile sidebar
function toggleSidebar() {
  if (sidebar?.classList.contains("hidden")) {
    openSidebar();
  } else {
    closeSidebar();
  }
}

// Open sidebar (mobile)
function openSidebar() {
  sidebar?.classList.remove("hidden");
  sidebarBackdrop?.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

// Close sidebar (mobile)
function closeSidebar() {
  sidebar?.classList.add("hidden");
  sidebarBackdrop?.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

// Toggle wallet dropdown
function toggleWalletDropdown() {
  walletDropdown.classList.toggle("hidden");
}

// Set up additional wallet-related event listeners
function setupWalletElements() {
  // Wallet connected button dropdown toggle
  if (walletConnectedBtn) {
    walletConnectedBtn.addEventListener("click", toggleWalletDropdown);
  }
  
  // Copy address button
  if (walletCopyAddressBtn && fullWalletAddressEl) {
    walletCopyAddressBtn.addEventListener("click", () => {
      const address = fullWalletAddressEl.textContent;
      if (address) {
        navigator.clipboard.writeText(address)
          .then(() => {
            walletCopyAddressBtn.textContent = "✓ Copied!";
            setTimeout(() => {
              walletCopyAddressBtn.innerHTML = `
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path>
                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path>
                </svg>
                Copy Address
              `;
            }, 2000);
          });
      }
    });
  }
  
  // View in explorer button
  if (walletViewExplorerBtn) {
    walletViewExplorerBtn.addEventListener("click", () => {
      if (currentUserAddress) {
        const networkConfig = contractInteractor.getCurrentNetwork();
        if (networkConfig.explorerUrl) {
          window.open(`${networkConfig.explorerUrl}/address/${currentUserAddress}`, '_blank');
        } else {
          alert("Block explorer not available for this network");
        }
      }
    });
  }
  
  // Disconnect wallet button
  if (walletDisconnectBtn) {
    walletDisconnectBtn.addEventListener("click", disconnectWallet);
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (walletConnectedContainer && walletDropdown && !walletConnectedContainer.contains(e.target as Node)) {
      walletDropdown.classList.add('hidden');
    }
  });
}

// Check if current user is registered
async function checkUserRegistration() {
  if (!currentUserAddress) return;
  
  try {
    console.log("Checking registration status for:", currentUserAddress);
    const userDetails = await contractInteractor.getUserDetails(currentUserAddress);
    console.log("User details:", userDetails);
    
    if (userDetails && userDetails.registered) {
      isRegistered = true;
      console.log("User is registered");
      
      // Save registration status in session storage to avoid repeated checks
      sessionStorage.setItem('isRegistered', 'true');
    } else {
      isRegistered = false;
      console.log("User is NOT registered");
      sessionStorage.removeItem('isRegistered');
    }
  } catch (error) {
    console.error("Error checking registration status:", error);
    
    // Fall back to session storage if available
    const storedStatus = sessionStorage.getItem('isRegistered');
    isRegistered = storedStatus === 'true';
  }
}

// Navigate to specific page
function navigateToPage(page: string) {
  // Remove active class from all links
  sidebarLinks.forEach(link => {
    link.classList.remove("active-nav", "bg-gray-100");
  });
  
  // Add active class to current page link
  const activeLink = document.querySelector(`[data-page="${page}"]`);
  if (activeLink) {
    activeLink.classList.add("active-nav", "bg-gray-100");
  }
  
  // Update localStorage
  localStorage.setItem("activePage", page);
  
  loadActivePage();
  
  // Close sidebar on mobile after navigation
  if (window.innerWidth < 1024) {
    closeSidebar();
  }
}

// Load active page content
async function loadActivePage() {
  const activePage = localStorage.getItem("activePage") || "home"; // Default to home page
  
  // Clear main content
  if (mainContent) {
    mainContent.innerHTML = "";
    
    // Load page content based on active page
    switch (activePage) {
      case "home":
        loadHomePage(mainContent);
        break;
      case "dashboard":
        await loadDashboard(mainContent, contractInteractor, currentUserAddress, isRegistered);
        break;
      case "register":
        await loadRegisterPage(mainContent, contractInteractor, currentUserAddress, isRegistered);
        break;
      case "levels":
        await loadLevelsPage(mainContent, contractInteractor, currentUserAddress, isRegistered);
        break;
      case "referrals":
        await loadReferralsPage(mainContent, contractInteractor, currentUserAddress, isRegistered);
        break;
      case "earnings":
        await loadEarningsPage(mainContent, contractInteractor, currentUserAddress, isRegistered);
        break;
      case "how-it-works":
        loadHowItWorks(mainContent);
        break;
      case "faq":
        loadFAQ(mainContent);
        break;
      default:
        loadHomePage(mainContent);
    }
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", init);

// Add type for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
