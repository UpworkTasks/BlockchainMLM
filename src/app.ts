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
import { loadAdminPage } from "./pages/admin";
import { showLoadingOverlay, hideLoadingOverlay } from "./components/loading-overlay";
import { getSelectedProvider } from './components/wallet-connector';
import { showErrorToast } from './components/toast-notification';
// Import types (including global Window interface extensions)
import "./types";
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
  
  // Update navigation links for owner status
  await updateNavLinks();
  
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
  
  // Remove network selection event listener - we only use Polygon mainnet now
  // networkSelect?.addEventListener("change", handleNetworkChange);
  
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

// Connect to wallet - with guaranteed overlay cleanup
async function connectWallet() {
  try {
    // Show loading overlay while connecting
    showLoadingOverlay("Initializing wallet connection...");
    
    try {
      currentUserAddress = await contractInteractor.connectWallet();
    } catch (error) {
      console.error("Contract interactor wallet connection error:", error);
      throw error; // Rethrow to be caught by the outer catch block
    } finally {
      // Always hide loading overlay after connection attempt
      hideLoadingOverlay();
    }
    
    if (currentUserAddress) {
      // Get wallet type for UI
      const walletProvider = getSelectedProvider();
      const walletType = walletProvider?.name || "Wallet";
      
      // Update UI to show connected wallet
      const shortenedAddress = await contractInteractor.getShortenedAddress(currentUserAddress);
      walletAddressSpan.textContent = shortenedAddress;
      fullWalletAddressEl.textContent = currentUserAddress;
      
      // Update wallet type indicator if available
      const walletTypeIndicator = document.getElementById("wallet-type-indicator");
      if (walletTypeIndicator) {
        walletTypeIndicator.textContent = walletType;
      }
      
      // Toggle visibility
      walletConnectBtn.classList.add("hidden");
      walletConnectedContainer.classList.remove("hidden");
      
      await checkUserRegistration();
      console.log("After connection - Registration status:", isRegistered);
      loadActivePage(); // Reload the active page with wallet info
    }
  } catch (error) {
    // Extra safety - ensure loading overlay is hidden
    hideLoadingOverlay();
    
    console.error("Failed to connect wallet:", error);
    showErrorToast("Failed to connect wallet. Please make sure your wallet is installed and unlocked.");
  } finally {
    // Triple-check that loading overlay is gone
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }
}

// Check if user is already connected
async function checkWalletConnection() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
    await updateNavLinks(); // Update navigation links after wallet connection
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

// Remove or simplify the handleNetworkChange function since we only use Polygon mainnet


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
      case "admin":
        // Only load admin page if user is the contract owner
        if (currentUserAddress) {
          try {
            const ownerAddress = await contractInteractor.getOwner();
            if (currentUserAddress.toLowerCase() === ownerAddress.toLowerCase()) {
              await loadAdminPage(mainContent, contractInteractor, currentUserAddress);
            } else {
              // If not owner, redirect to dashboard
              loadDashboard(mainContent, contractInteractor, currentUserAddress, isRegistered);
              localStorage.setItem("activePage", "dashboard");
              // Update active nav class
              sidebarLinks.forEach(link => {
                if (link.getAttribute("data-page") === "dashboard") {
                  link.classList.add("active-nav", "bg-gray-100");
                } else {
                  link.classList.remove("active-nav", "bg-gray-100");
                }
              });
            }
          } catch (error) {
            console.error("Error checking owner status:", error);
            loadDashboard(mainContent, contractInteractor, currentUserAddress, isRegistered);
          }
        } else {
          // If not connected, load home page
          loadHomePage(mainContent);
        }
        break;
      default:
        loadHomePage(mainContent);
    }
  }
  
  // Update the navigation links for owner status
  await updateNavLinks();
}

// Update navigation links
async function updateNavLinks() {
  // Get all sidebar links - RENAMED from sidebarLinks to navLinksElements to avoid shadowing
  
  // Check if current user is the contract owner
  let isOwner = false;
  if (currentUserAddress) {
    try {
      const ownerAddress = await contractInteractor.getOwner();
      isOwner = currentUserAddress.toLowerCase() === ownerAddress.toLowerCase();
    } catch (error) {
      console.error("Error checking owner status:", error);
    }
  }
  
  // Get the navigation list container
  const navList = document.querySelector("#sidebar ul");
  
  // Add admin link if user is owner and it doesn't exist yet
  if (isOwner && navList && !document.querySelector('[data-page="admin"]')) {
    const adminLi = document.createElement("li");
    adminLi.innerHTML = `
      <a href="#" data-page="admin" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
        <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.146-.32-2.217-.868-3.284A5 5 0 0010 7z" clip-rule="evenodd"></path>
        </svg>
        <span class="ml-3">Admin</span>
      </a>
    `;
    navList.appendChild(adminLi);
    
    // Add event listener to new admin link
    const adminLink = adminLi.querySelector('a');
    if (adminLink) {
      adminLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigateToPage("admin");
      });
    }
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", init);
