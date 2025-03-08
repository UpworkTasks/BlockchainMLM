export function loadHowItWorks(container: HTMLElement): void {
  container.innerHTML = `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">How It Works</h2>
      
      <div class="mb-6 p-6 bg-white rounded-lg shadow">
        <h3 class="text-xl font-bold mb-4 text-polygon-purple">Understanding the Polygon MLM System</h3>
        <p class="mb-4 text-gray-700">
          The Polygon MLM system is a decentralized, blockchain-based multi-level marketing platform that
          allows participants to earn rewards through referrals and building a network.
        </p>
        <p class="mb-4 text-gray-700">
          The system operates on the Polygon blockchain, ensuring transparency, security, and 
          immutable record-keeping of all transactions and referral relationships.
        </p>
      </div>
      
      <div class="mb-6 p-6 bg-white rounded-lg shadow">
        <h3 class="text-xl font-bold mb-4 text-polygon-purple">Core Features</h3>
        
        <div class="mb-4">
          <h4 class="font-bold text-lg">🔗 8-Level Referral Structure</h4>
          <p class="text-gray-700 mb-2">Our system has 8 distinct levels, each with its own pricing and rewards.</p>
          <ul class="list-disc list-inside text-gray-700 pl-4">
            <li>Level 1: 200 POL</li>
            <li>Level 2: 600 POL</li>
            <li>Level 3: 1,800 POL</li>
            <li>Level 4: 5,400 POL</li>
            <li>Level 5: 16,200 POL</li>
            <li>Level 6: 48,600 POL</li>
            <li>Level 7: 145,800 POL</li>
            <li>Level 8: 437,400 POL</li>
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="font-bold text-lg">💸 Direct P2P Payments</h4>
          <p class="text-gray-700 mb-2">All payments are made directly between participants' wallets, ensuring fast and secure transactions.</p>
        </div>
        
        <div class="mb-4">
          <h4 class="font-bold text-lg">🔒 Decentralized and Secure</h4>
          <p class="text-gray-700 mb-2">The system operates entirely on the blockchain, with no central authority or intermediaries.</p>
        </div>
        
        <div class="mb-4">
          <h4 class="font-bold text-lg">🌐 Global Accessibility</h4>
          <p class="text-gray-700 mb-2">Anyone with a Polygon-compatible wallet can participate, regardless of their location.</p>
        </div>
      </div>
      
      <div class="mb-6 p-6 bg-white rounded-lg shadow">
        <h3 class="text-xl font-bold mb-4 text-polygon-purple">Income Structure</h3>
        <p class="mb-4 text-gray-700">The MLM has an 8-level structure, with each level unlocking greater earning potential:</p>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Level</th>
                <th scope="col" class="px-6 py-3">Cost to Purchase</th>
                <th scope="col" class="px-6 py-3">Potential Referrals</th>
                <th scope="col" class="px-6 py-3">Potential Earnings</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium">Level 1</td>
                <td class="px-6 py-4">200 POL (registration)</td>
                <td class="px-6 py-4">3 direct</td>
                <td class="px-6 py-4">600 POL</td>
              </tr>
              <tr class="bg-gray-50 border-b">
                <td class="px-6 py-4 font-medium">Level 2</td>
                <td class="px-6 py-4">600 POL</td>
                <td class="px-6 py-4">9 (3×3)</td>
                <td class="px-6 py-4">1,800 POL</td>
              </tr>
              <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium">Level 3</td>
                <td class="px-6 py-4">1,800 POL</td>
                <td class="px-6 py-4">27 (3×9)</td>
                <td class="px-6 py-4">5,400 POL</td>
              </tr>
              <tr class="bg-gray-50 border-b">
                <td class="px-6 py-4 font-medium">Level 4</td>
                <td class="px-6 py-4">5,400 POL</td>
                <td class="px-6 py-4">81 (3×27)</td>
                <td class="px-6 py-4">16,200 POL</td>
              </tr>
              <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium">Level 5</td>
                <td class="px-6 py-4">16,200 POL</td>
                <td class="px-6 py-4">243 (3×81)</td>
                <td class="px-6 py-4">48,600 POL</td>
              </tr>
              <tr class="bg-gray-50 border-b">
                <td class="px-6 py-4 font-medium">Level 6</td>
                <td class="px-6 py-4">48,600 POL</td>
                <td class="px-6 py-4">729 (3×243)</td>
                <td class="px-6 py-4">145,800 POL</td>
              </tr>
              <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium">Level 7</td>
                <td class="px-6 py-4">145,800 POL</td>
                <td class="px-6 py-4">2,187 (3×729)</td>
                <td class="px-6 py-4">437,400 POL</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="px-6 py-4 font-medium">Level 8</td>
                <td class="px-6 py-4">437,400 POL</td>
                <td class="px-6 py-4">6,561 (3×2,187)</td>
                <td class="px-6 py-4">1,312,200 POL</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="mb-6 p-6 bg-white rounded-lg shadow">
        <h3 class="text-xl font-bold mb-4 text-polygon-purple">Key Benefits</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 class="font-bold text-lg mb-2 text-polygon-purple">Full Decentralization</h4>
            <p class="text-gray-600">The system operates entirely on the blockchain with no central authority.</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 class="font-bold text-lg mb-2 text-polygon-purple">Smart Overflow</h4>
            <p class="text-gray-600">Extra referrals automatically flow down to help your team grow.</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 class="font-bold text-lg mb-2 text-polygon-purple">Unstoppable System</h4>
            <p class="text-gray-600">As a blockchain-based system, it cannot be shut down or censored.</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 class="font-bold text-lg mb-2 text-polygon-purple">Direct Payments</h4>
            <p class="text-gray-600">Payments go directly to participants' wallets with no intermediaries.</p>
          </div>
        </div>
      </div>
      
      <div class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-xl font-bold mb-4 text-polygon-purple">Getting Started</h3>
        <div class="p-4 bg-blue-50 text-blue-800 rounded-lg mb-4">
          <p>To get started with Polygon MLM, you need:</p>
        </div>
        <ol class="space-y-2 text-gray-600 list-decimal list-inside">
          <li>A Polygon-compatible wallet (MetaMask recommended)</li>
          <li>200 POL for registration</li>
          <li>A referrer's link (or the system will assign one)</li>
        </ol>
        <div class="mt-6 flex justify-center">
          <button id="get-started-btn" class="px-6 py-3 bg-polygon-purple text-white rounded-lg hover:bg-polygon-dark focus:outline-none focus:ring-2 focus:ring-polygon-light">
            Register Now
          </button>
        </div>
      </div>
    </div>
  `;

  // Add event listener for the "Register Now" button
  const getStartedBtn = document.getElementById("get-started-btn");
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      localStorage.setItem("activePage", "register");
      window.dispatchEvent(new Event("navigate"));
    });
  }
}