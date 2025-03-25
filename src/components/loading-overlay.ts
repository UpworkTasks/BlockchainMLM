/**
 * Loading Overlay Component
 * Provides functions to show and hide a loading overlay
 */

/**
 * Show loading overlay with optional message
 * @param message - Message to display in the loading overlay
 */
export function showLoadingOverlay(message?: string): void {
  const loadingOverlay = document.getElementById('loading-overlay');
  
  if (loadingOverlay) {
    // Add message if provided
    if (message) {
      const messageElement = document.createElement('p');
      messageElement.className = 'text-white mt-4 text-lg';
      messageElement.textContent = message;
      
      // Clear any existing messages
      const existingMessage = loadingOverlay.querySelector('p');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Add new message
      loadingOverlay.querySelector('.text-center')?.appendChild(messageElement);
    }
    
    loadingOverlay.style.display = 'flex';
  } else {
    // Create new overlay if it doesn't exist
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50';
    
    overlay.innerHTML = `
      <div class="text-center">
        <div class="w-20 h-20 border-4 border-polygon-purple border-t-transparent rounded-full animate-spin mx-auto relative">
          <div class="absolute inset-0 flex items-center justify-center">
            <img src="./src/assets/polygon-logo.svg" class="w-10 h-10" alt="Loading">
          </div>
        </div>
        <p class="text-white mt-4 text-lg font-medium">${message}</p>
      </div>
    `;
    
    document.body.appendChild(overlay);
  }
}

/**
 * Hide loading overlay
 */
export function hideLoadingOverlay(): void {
  const loadingOverlay = document.getElementById('loading-overlay');
  
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
    
    // Clear any messages
    const messageElement = loadingOverlay.querySelector('p');
    if (messageElement) {
      messageElement.remove();
    }
  }
}
