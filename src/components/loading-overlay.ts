/**
 * Loading Overlay Component
 * Provides functions to show and hide a loading overlay
 */

/**
 * Shows a loading overlay with a custom message
 * @param message The message to display in the loading overlay
 */
export function showLoadingOverlay(message: string = "Loading..."): void {
  const existingOverlay = document.getElementById('loading-overlay');
  
  if (existingOverlay) {
    // Update existing overlay
    const messageElement = existingOverlay.querySelector('p');
    if (messageElement) messageElement.textContent = message;
    existingOverlay.style.display = 'flex';
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
 * Hides the loading overlay if it exists
 */
export function hideLoadingOverlay(): void {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}
