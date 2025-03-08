/**
 * FAQ Page Component
 * Displays frequently asked questions about the Polygon MLM system
 */
export function loadFAQ(container: HTMLElement): void {
  container.innerHTML = `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      
      <div class="space-y-6">
        <!-- General Questions Section -->
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4 text-polygon-purple">General Questions</h3>
          
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-1" data-collapse-toggle="faq-1">
                <span>What is the Polygon MLM System?</span>
                <svg class="w-5 h-5 rotate-180" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-1" class="mt-2">
                <p class="text-gray-700">
                  The Polygon MLM System is a decentralized Multi-Level Marketing platform built on the Polygon blockchain. 
                  It allows participants to join a referral program, invite others, and earn rewards based on an 8-level 
                  referral structure.
                </p>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-2" data-collapse-toggle="faq-2">
                <span>How is this different from traditional MLM systems?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-2" class="hidden mt-2">
                <p class="text-gray-700">This system differs from traditional MLM programs in several ways:</p>
                <ul class="list-disc pl-5 mt-2 text-gray-700">
                  <li>It's fully decentralized, with no central company controlling funds</li>
                  <li>All transactions happen directly between participants (peer-to-peer)</li>
                  <li>The smart contract automatically enforces rules and distributes payments</li>
                  <li>Once deployed, the system cannot be shut down or manipulated</li>
                  <li>No physical products are involved; it's a pure referral system</li>
                </ul>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-3" data-collapse-toggle="faq-3">
                <span>Is this legal?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-3" class="hidden mt-2">
                <p class="text-gray-700">
                  The Polygon MLM system is a decentralized application running on blockchain technology. 
                  Regulations regarding MLM systems vary by country. Users should consult with local legal 
                  experts about the legality of participating in MLM systems in their jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Registration & Participation Section -->
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4 text-polygon-purple">Registration & Participation</h3>
          
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-4" data-collapse-toggle="faq-4">
                <span>How do I join the Polygon MLM system?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-4" class="hidden mt-2">
                <p class="text-gray-700">To join the system:</p>
                <ol class="list-decimal pl-5 mt-2 text-gray-700">
                  <li>You need a Polygon-compatible wallet (like MetaMask) with POL tokens</li>
                  <li>Connect your wallet to the dApp interface</li>
                  <li>Enter an existing member's referral address (or leave blank for system-assigned referral)</li>
                  <li>Pay the 200 POL registration fee</li>
                  <li>Confirm the transaction in your wallet</li>
                </ol>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-5" data-collapse-toggle="faq-5">
                <span>How much does it cost to join?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-5" class="hidden mt-2">
                <p class="text-gray-700">
                  Registration costs 200 POL (Polygon tokens). This fee is paid directly to your referrer.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Levels & Earnings Section -->
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4 text-polygon-purple">Levels & Earnings</h3>
          
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-6" data-collapse-toggle="faq-6">
                <span>How many levels are in the system?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-6" class="hidden mt-2">
                <p class="text-gray-700">The system has 8 levels:</p>
                <ul class="list-disc pl-5 mt-2 text-gray-700">
                  <li>Level 1: Entry level (200 POL)</li>
                  <li>Level 2: 600 POL</li>
                  <li>Level 3: 1,800 POL</li>
                  <li>Level 4: 5,400 POL</li>
                  <li>Level 5: 16,200 POL</li>
                  <li>Level 6: 48,600 POL</li>
                  <li>Level 7: 145,800 POL</li>
                  <li>Level 8: 437,400 POL</li>
                </ul>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-7" data-collapse-toggle="faq-7">
                <span>How do I earn money in this system?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-7" class="hidden mt-2">
                <p class="text-gray-700">You earn money when:</p>
                <ol class="list-decimal pl-5 mt-2 text-gray-700">
                  <li>People you refer register using your referral link (you receive 200 POL per direct referral)</li>
                  <li>Your network grows and people upgrade to higher levels</li>
                  <li>Overflow referrals from your upline are placed under you</li>
                </ol>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-8" data-collapse-toggle="faq-8">
                <span>What is the maximum number of direct referrals I can have?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-8" class="hidden mt-2">
                <p class="text-gray-700">
                  You can have a maximum of 3 direct referrals. Any additional referrals will overflow to your downline.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Technical Questions Section -->
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4 text-polygon-purple">Technical Questions</h3>
          
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-9" data-collapse-toggle="faq-9">
                <span>What blockchain is this built on?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-9" class="hidden mt-2">
                <p class="text-gray-700">
                  The system is built on the Polygon blockchain, which offers low transaction fees and fast confirmation times.
                </p>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-10" data-collapse-toggle="faq-10">
                <span>How do I know the system is secure?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-10" class="hidden mt-2">
                <p class="text-gray-700">The smart contract code is open-source and has been audited. Being on the blockchain means:</p>
                <ul class="list-disc pl-5 mt-2 text-gray-700">
                  <li>Transactions are transparent and verifiable</li>
                  <li>The contract cannot be altered once deployed</li>
                  <li>Rules are enforced by code, not people</li>
                  <li>No single entity can shut down the system</li>
                </ul>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-11" data-collapse-toggle="faq-11">
                <span>What happens if the website goes down?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-11" class="hidden mt-2">
                <p class="text-gray-700">
                  The website is just an interface to interact with the smart contract. Even if the website goes down, the smart contract will continue to operate on the blockchain. You can still interact with it using other methods like direct contract interaction through Etherscan or by building your own interface.
                </p>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-12" data-collapse-toggle="faq-12">
                <span>Can the contract owner take my funds?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-12" class="hidden mt-2">
                <p class="text-gray-700">
                  No. The contract is designed so that all payments flow directly between participants. The contract owner cannot access or withdraw funds from participants. The only funds the owner can withdraw are those accidentally sent directly to the contract address.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Support & Help Section -->
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4 text-polygon-purple">Support & Help</h3>
          
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-13" data-collapse-toggle="faq-13">
                <span>Where can I get help if I have problems?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-13" class="hidden mt-2">
                <p class="text-gray-700">For technical support with the dApp, please join our community channels:</p>
                <ul class="list-disc pl-5 mt-2 text-gray-700">
                  <li>Telegram: <a href="#" class="text-polygon-purple hover:underline">BlockchainMLM Community</a></li>
                  <li>Discord: <a href="#" class="text-polygon-purple hover:underline">BlockchainMLM Server</a></li>
                  <li>Email: <a href="mailto:support@example.com" class="text-polygon-purple hover:underline">support@example.com</a></li>
                </ul>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-14" data-collapse-toggle="faq-14">
                <span>What if I send funds to the wrong address?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-14" class="hidden mt-2">
                <p class="text-gray-700">
                  Unfortunately, blockchain transactions are irreversible. Always double-check addresses before sending any funds. The system is designed to only accept transactions that follow the smart contract rules, so if you send funds directly to an address outside the contract functions, those funds cannot be recovered.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Smart Contract Section -->
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4 text-polygon-purple">Smart Contract</h3>
          
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-15" data-collapse-toggle="faq-15">
                <span>Can I view the smart contract code?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-15" class="hidden mt-2">
                <p class="text-gray-700">
                  Yes, the smart contract is open-source and can be viewed on Polygonscan. The contract is verified, meaning anyone can review the code to understand exactly how it works. You can find the contract address in the footer of this website.
                </p>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-4">
              <button class="flex items-center justify-between w-full text-left font-medium text-gray-900 focus:outline-none" aria-controls="faq-16" data-collapse-toggle="faq-16">
                <span>How are transaction fees handled?</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <div id="faq-16" class="hidden mt-2">
                <p class="text-gray-700">
                  Transaction fees (gas) are paid by the person initiating the transaction. These fees go directly to the Polygon network validators, not to any participant or the contract owner. Polygon has very low transaction fees compared to Ethereum, typically costing just a few cents per transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize the FAQ accordion functionality
  setupAccordions(container);
}

/**
 * Sets up the accordion functionality for the FAQ items
 */
function setupAccordions(container: HTMLElement): void {
  const accordionButtons = container.querySelectorAll('[data-collapse-toggle]');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', function(this: HTMLElement) {
      const targetId = this.getAttribute('data-collapse-toggle');
      const targetElement = document.getElementById(targetId as string);
      
      if (targetElement) {
        const isHidden = targetElement.classList.contains('hidden');
        
        // Toggle the target element visibility
        if (isHidden) {
          targetElement.classList.remove('hidden');
          this.querySelector('svg')?.classList.add('rotate-180');
        } else {
          targetElement.classList.add('hidden');
          this.querySelector('svg')?.classList.remove('rotate-180');
        }
      }
    });
  });
}