export function loadHomePage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="home-container overflow-hidden">
      <!-- Hero Section with Background Image -->
      <section class="relative min-h-screen overflow-hidden">
        <!-- Background Image -->
        <div class="absolute inset-0">
          <img src="https://i.ibb.co/fdmPPYx2/MLM.png" alt="Crypto Real Estate Background" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-b from-polygon-dark/70 via-polygon-purple/50 to-indigo-800/70"></div>
        </div>
        
        <!-- Pattern Overlay -->
        <div class="absolute inset-0 opacity-10">
          <div class="grid-pattern"></div>
        </div>
        
        <!-- Hero Content -->
        <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <!-- Main Content - Title and Description Text -->
          <div class="mt-8 max-w-3xl mx-auto fade-in-up bg-black bg-opacity-40 rounded-xl p-6 backdrop-blur-sm border border-white/10" style="animation-delay: 0.5s">
            <h1 class="text-5xl md:text-6xl font-extrabold text-white text-center mb-2">
              CRYPTO REAL ESTATE
            </h1>
            <p class="text-xl text-white text-opacity-90 text-center mb-6">
              VIRTUAL PROPERTIES · REAL EARNINGS
            </p>
            
            <p class="text-xl text-white text-opacity-90 text-center mb-4">
              Grow your virtual real estate empire by renting apartments with sublet rights. Build your network of real estate agents with our powerful 3x8 matrix structure with spillover and create a passive income stream helping them.
            </p>
            
            <p class="text-2xl font-bold text-white text-center mb-6">
              A Real Estate virtual NFT that actually makes you money.
            </p>
          </div>
          
          <!-- CTA Buttons -->
          <div class="mt-8 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-6 fade-in-up" style="animation-delay: 0.7s">
            <a href="#" id="home-register-button" class="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl shadow-lg text-polygon-purple bg-white hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path>
              </svg>
              Join the game now
            </a>
            <a href="#" id="home-learn-button" class="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl shadow-lg text-white bg-white bg-opacity-10 border-2 border-white border-opacity-20 backdrop-blur-sm hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300">
              <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"></path>
              </svg>
              How It Works
            </a>
          </div>

          <!-- Support Links -->
          <div class="mt-12 py-3 px-6 bg-black/30 backdrop-blur-sm rounded-full flex flex-wrap justify-center gap-6 text-white fade-in-up" style="animation-delay: 0.9s">
            <a href="#" id="home-faq-link" class="text-white hover:text-purple-200 transition-colors">
              FAQ
            </a>
           
            <span class="text-gray-400">•</span>
            <a href="https://t.me/+5aATGQKT0NE0ZDJk" target="_blank" class="text-white hover:text-purple-200 transition-colors flex items-center">
              <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm2.505 15.578l-.921-4.518 4.948-4.445c.217-.198-.047-.302-.337-.113l-6.109 3.862-2.631-.878c-.57-.181-.579-.637.126-.953l10.266-4.277c.469-.204.887.153.721.847l-1.748 8.858c-.123.619-.463.768-.953.478l-2.637-1.955-1.267 1.246c-.14.14-.257.257-.458.257z" />
              </svg>
              Help & Support
            </a>
           
        </div>
        
        <!-- Scroll Indicator -->
        <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg class="w-6 h-6 text-white" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <!-- Investment Section -->
      <section class="relative py-20 lg:py-32 bg-white z-20">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-16">
            <span class="px-4 py-1.5 text-sm font-semibold text-polygon-purple bg-polygon-ultralight rounded-full inline-block mb-3">INVESTMENT OPPORTUNITY</span>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              Simple and Powerful Investment
            </h2>
            <p class="max-w-3xl mx-auto text-xl text-gray-600">
              Invest once and build your network with our 3x8 matrix structure with spillover system
            </p>
          </div>

          <div class="flex justify-center">
            <!-- Single Investment Card -->
            <div class="property-card transform hover:-translate-y-2 transition-all duration-300 max-w-md w-full">
              <div class="overflow-hidden rounded-xl shadow-xl">
                <div class="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                  <div class="absolute inset-0 bg-pattern-overlay opacity-20"></div>
                  <div class="p-6 h-full flex flex-col justify-between">
                    <div class="flex justify-between">
                      <span class="bg-white bg-opacity-30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">ENTRY LEVEL</span>
                      <span class="bg-green-500 bg-opacity-90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">ONE-TIME</span>
                    </div>
                    <div>
                      <h3 class="text-2xl text-white font-bold text-shadow-sm">Matrix Position</h3>
                      <p class="text-white text-opacity-90 text-sm">Begin your earning journey</p>
                    </div>
                  </div>
                <div class="p-6 bg-white border border-gray-100 rounded-b-xl">
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="text-sm font-medium text-gray-500">INVESTMENT</span>
                      <p class="text-xl font-bold text-gray-800">200 POL</p>
                    </div>
                    <div class="text-right">
                      <span class="text-sm font-medium text-gray-500">STRUCTURE</span>
                      <p class="text-xl font-bold text-green-600">3×8 Matrix</p>
                    </div>
                  </div>
                  <button class="w-full mt-5 py-3 rounded-lg bg-polygon-purple text-white font-medium hover:bg-polygon-dark transition-all duration-300 shadow-md">
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="py-20 lg:py-32 bg-gray-50 relative z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="px-4 py-1.5 text-sm font-semibold text-polygon-purple bg-polygon-ultralight rounded-full inline-block mb-3">THE PROCESS</span>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              How <span class="text-polygon-purple">Crypto Real Estate</span> Works
            </h2>
            <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Follow these simple steps to start building your network and earning passive income.
            </p>
          </div>

          <!-- Step Timeline - Horizontal Scrollable on Mobile -->
          <div class="relative">
            <div class="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-polygon-light to-polygon-dark transform -translate-y-1/2 hidden md:block"></div>
            
            <div class="grid md:grid-cols-5 gap-8 md:gap-6 relative">
              <!-- Step 1 -->
              <div class="process-step md:text-center bg-white p-6 rounded-lg shadow-md" data-step="1">
                <div class="relative flex md:flex-col items-center md:justify-center">
                  <div class="md:mb-6 flex-shrink-0 relative">
                    <div class="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-polygon-purple to-polygon-dark text-white font-bold text-xl shadow-lg z-10 relative">
                      1
                    </div>
                  </div>
                  
                  <div class="ml-6 md:ml-0">
                    <h3 class="text-xl font-bold text-gray-900">Connect Wallet</h3>
                    <p class="mt-2 text-base text-gray-600">
                      Connect your Polygon wallet securely to our platform to get started.
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Step 2 -->
              <div class="process-step md:text-center bg-white p-6 rounded-lg shadow-md" data-step="2">
                <div class="relative flex md:flex-col items-center md:justify-center">
                  <div class="md:mb-6 flex-shrink-0 relative">
                    <div class="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-polygon-purple to-polygon-dark text-white font-bold text-xl shadow-lg z-10 relative">
                      2
                    </div>
                  </div>
                  
                  <div class="ml-6 md:ml-0">
                    <h3 class="text-xl font-bold text-gray-900">Register</h3>
                    <p class="mt-2 text-base text-gray-600">
                      Register with 200 POL to secure your position in our 3×8 matrix.
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Step 3 -->
              <div class="process-step md:text-center bg-white p-6 rounded-lg shadow-md" data-step="3">
                <div class="relative flex md:flex-col items-center md:justify-center">
                  <div class="md:mb-6 flex-shrink-0 relative">
                    <div class="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-polygon-purple to-polygon-dark text-white font-bold text-xl shadow-lg z-10 relative">
                      3
                    </div>
                  </div>
                  
                  <div class="ml-6 md:ml-0">
                    <h3 class="text-xl font-bold text-gray-900">Invite Others</h3>
                    <p class="mt-2 text-base text-gray-600">
                      Share your referral link to grow your network with spillover benefits.
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Step 4 -->
              <div class="process-step md:text-center bg-white p-6 rounded-lg shadow-md" data-step="4">
                <div class="relative flex md:flex-col items-center md:justify-center">
                  <div class="md:mb-6 flex-shrink-0 relative">
                    <div class="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-polygon-purple to-polygon-dark text-white font-bold text-xl shadow-lg z-10 relative">
                      4
                    </div>
                  </div>
                  
                  <div class="ml-6 md:ml-0">
                    <h3 class="text-xl font-bold text-gray-900">Benefit from Spillover</h3>
                    <p class="mt-2 text-base text-gray-600">
                      Receive new members in your downline through our smart spillover system.
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Step 5 -->
              <div class="process-step md:text-center bg-white p-6 rounded-lg shadow-md" data-step="5">
                <div class="relative flex md:flex-col items-center md:justify-center">
                  <div class="md:mb-6 flex-shrink-0 relative">
                    <div class="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-polygon-purple to-polygon-dark text-white font-bold text-xl shadow-lg z-10 relative">
                      5
                    </div>
                  </div>
                  
                  <div class="ml-6 md:ml-0">
                    <h3 class="text-xl font-bold text-gray-900">Collect Earnings</h3>
                    <p class="mt-2 text-base text-gray-600">
                      Earn passive income through your growing network in the 3×8 matrix.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 lg:py-32 bg-gray-900 relative z-20 overflow-hidden">
        <!-- Background Light Effect -->
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-polygon-purple rounded-full filter blur-3xl opacity-10"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="text-center mb-16">
            <span class="px-4 py-1.5 text-sm font-semibold text-polygon-purple bg-gray-800 rounded-full inline-block mb-3">WHY CHOOSE US</span>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Revolutionary <span class="text-polygon-purple">3×8 Matrix</span> System
            </h2>
            <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              Our blockchain-based MLM system offers unique advantages that traditional systems can't match.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-10">
            <!-- Feature 1 -->
            <div class="feature-card">
              <div class="bg-gray-800 rounded-xl overflow-hidden h-full shadow-xl border border-gray-700">
                <div class="p-8">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-polygon-light to-polygon-dark flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-300">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-4">3×8 Matrix Structure</h3>
                  <p class="text-gray-300 leading-relaxed mb-6">
                    Simple but powerful matrix structure with 3 referrals width and 8 levels depth, allowing you to build a large network efficiently.
                  </p>
                  <div class="h-1 w-12 bg-gradient-to-r from-polygon-light to-polygon-dark"></div>
                </div>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="feature-card">
              <div class="bg-gray-800 rounded-xl overflow-hidden h-full shadow-xl border border-gray-700">
                <div class="p-8">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-polygon-light to-polygon-dark flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-300">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-4">Smart Spillover System</h3>
                  <p class="text-gray-300 leading-relaxed mb-6">
                    Our innovative spillover system automatically assigns excess referrals to your downline, ensuring maximum network growth and passive income opportunities.
                  </p>
                  <div class="h-1 w-12 bg-gradient-to-r from-polygon-light to-polygon-dark"></div>
                </div>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="feature-card">
              <div class="bg-gray-800 rounded-xl overflow-hidden h-full shadow-xl border border-gray-700">
                <div class="p-8">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-polygon-light to-polygon-dark flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-300">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-4">Fixed Earning Structure</h3>
                  <p class="text-gray-300 leading-relaxed mb-6">
                    Unlike traditional MLMs, we offer a transparent system with fixed earnings per referral across all levels, providing stable and predictable passive income.
                  </p>
                  <div class="h-1 w-12 bg-gradient-to-r from-polygon-light to-polygon-dark"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  // Add event listeners for navigation buttons
  
  // Main CTA buttons
  const registerButton = document.getElementById("home-register-button");
  if (registerButton) {
    registerButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("activePage", "register");
      window.dispatchEvent(new Event("navigate"));
    });
  }
  
  const learnButton = document.getElementById("home-learn-button");
  if (learnButton) {
    learnButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("activePage", "how-it-works");
      window.dispatchEvent(new Event("navigate"));
    });
  }
  
  const faqLink = document.getElementById("home-faq-link");
  if (faqLink) {
    faqLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("activePage", "faq");
      window.dispatchEvent(new Event("navigate"));
    });
  }
  
  // Investment buttons on property cards
  const investButtons = container.querySelectorAll(".property-card button");
  investButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("activePage", "register");
      window.dispatchEvent(new Event("navigate"));
    });
  });
}
