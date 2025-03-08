export function loadHomePage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="home-container overflow-hidden">
      <!-- Hero Section with 3D Animation -->
      <section class="relative min-h-screen overflow-hidden">
        <!-- Dynamic Background -->
        <div class="absolute inset-0 bg-gradient-to-b from-polygon-dark via-polygon-purple to-indigo-800"></div>
        
        <!-- Pattern Overlay -->
        <div class="absolute inset-0 opacity-10">
          <div class="grid-pattern"></div>
        </div>
        
        <!-- Hero Content -->
        <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <!-- Logo Animation -->
          <div class="w-full max-w-4xl mb-10 fade-in-up">
            <div class="rounded-2xl bg-black bg-opacity-30 backdrop-blur-md p-7 shadow-lg inline-block w-full border border-white border-opacity-10">
              <svg viewBox="0 0 600 140" xmlns="http://www.w3.org/2000/svg" class="w-full">
                <defs>
                  <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#FFFFFF" />
                    <stop offset="50%" stop-color="#F0F0F0" />
                    <stop offset="100%" stop-color="#FFFFFF" />
                    <animate attributeName="x1" from="0%" to="100%" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="x2" from="100%" to="200%" dur="3s" repeatCount="indefinite" />
                  </linearGradient>
                  
                  <!-- City skyline pattern -->
                  <pattern id="cityPattern" x="0" y="0" width="600" height="100" patternUnits="userSpaceOnUse">
                    ${Array(15).fill(0).map((_, i) => 
                      `<rect x="${40 + i*40}" y="${20 + Math.floor(Math.random()*50)}" width="${20 + Math.floor(Math.random()*20)}" 
                      height="${60 + Math.floor(Math.random()*40)}" fill="white" opacity="0.2" class="building-rect" 
                      style="animation-delay: ${i*0.1}s" />`
                    ).join('')}
                  </pattern>
                </defs>
                
                <!-- Background Pattern -->
                <rect x="0" y="40" width="600" height="100" fill="url(#cityPattern)" />
                
                <!-- Main Title with Effects -->
                <text x="300" y="80" font-family="Inter, sans-serif" font-weight="800" font-size="50" text-anchor="middle" 
                fill="url(#titleGradient)" class="text-glow">CRYPTO REALESTATE</text>
                <text x="300" y="115" font-family="Inter, sans-serif" font-size="20" text-anchor="middle" 
                fill="white" font-weight="500" class="text-shadow-sm">VIRTUAL PROPERTY · REAL EARNINGS</text>
              </svg>
            </div>
          </div>
          
          <!-- Main Headline -->
          <h1 class="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white text-center max-w-5xl fade-in-up text-shadow-lg" style="animation-delay: 0.3s">
            <span class="block mb-4">Build Your <span class="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">Virtual Real Estate</span> Empire</span>
            <span class="block text-white text-opacity-80 text-2xl md:text-3xl lg:text-4xl mt-3 font-light">The Future of Property Investment on Blockchain</span>
          </h1>
          
          <!-- Description -->
          <p class="mt-8 max-w-2xl mx-auto text-xl text-white text-opacity-90 text-center fade-in-up text-shadow-sm" style="animation-delay: 0.5s">
            Join the next revolution in digital property ownership. Build your network with our powerful 3x8 matrix structure with spillover and create a passive income stream.
          </p>
          
          <!-- CTA Buttons -->
          <div class="mt-12 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-6 fade-in-up" style="animation-delay: 0.7s">
            <a href="#" id="home-register-button" class="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl shadow-lg text-polygon-purple bg-white hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path>
              </svg>
              Start Earning Now
            </a>
            <a href="#" id="home-learn-button" class="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl shadow-lg text-white bg-white bg-opacity-10 border-2 border-white border-opacity-20 backdrop-blur-sm hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300">
              <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"></path>
              </svg>
              How It Works
            </a>
          </div>

          <!-- Trusted By Section (Replacing Stats Counter) -->
          <div class="mt-16 max-w-5xl w-full px-4 fade-in-up" style="animation-delay: 0.9s">
            <p class="text-center text-white text-opacity-60 text-sm uppercase tracking-wider mb-6">Powered by advanced blockchain technology</p>
            
          </div>
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
