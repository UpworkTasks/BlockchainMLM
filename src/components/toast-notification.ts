// Toast notification system

enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClick?: () => void;
}

export function showToast(message: string, type: ToastType = ToastType.INFO, options: ToastOptions = {}) {
  const defaultOptions = {
    duration: 5000,
    position: 'bottom-right'
  };
  
  const mergedOptions = { ...defaultOptions, ...options } as Required<ToastOptions>;
  
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = `fixed z-50 ${getPositionClasses(mergedOptions.position)}`;
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `p-4 mb-3 flex items-center rounded-lg shadow-lg transition-all transform translate-x-0 ease-out duration-300 ${getTypeClasses(type)}`;
  toast.style.minWidth = '300px';
  toast.style.maxWidth = '450px';
  
  // Create icon
  const icon = document.createElement('div');
  icon.className = 'flex-shrink-0 mr-3';
  icon.innerHTML = getIconByType(type);
  
  // Create message
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex-grow text-sm';
  messageDiv.textContent = message;
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'ml-4 flex-shrink-0 bg-transparent border-0 text-current opacity-75 hover:opacity-100 rounded focus:outline-none';
  closeButton.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `;
  closeButton.addEventListener('click', () => {
    removeToast(toast);
  });
  
  // Add click handler to the toast if provided
  if (mergedOptions.onClick) {
    toast.addEventListener('click', (e) => {
      if (e.target !== closeButton) {
        mergedOptions.onClick();
      }
    });
    toast.style.cursor = 'pointer';
  }
  
  // Append elements
  toast.appendChild(icon);
  toast.appendChild(messageDiv);
  toast.appendChild(closeButton);
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Add entrance animation
  setTimeout(() => {
    toast.classList.add('opacity-100');
  }, 10);
  
  // Auto remove after duration
  if (mergedOptions.duration > 0) {
    setTimeout(() => {
      removeToast(toast);
    }, mergedOptions.duration);
  }
}

function removeToast(toast: HTMLElement) {
  toast.classList.add('opacity-0');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
      
      // Remove container if no more toasts
      const toastContainer = document.getElementById('toast-container');
      if (toastContainer && toastContainer.childNodes.length === 0) {
        document.body.removeChild(toastContainer);
      }
    }
  }, 300);
}

function getPositionClasses(position: string): string {
  switch (position) {
    case 'top-right': return 'top-4 right-4';
    case 'top-left': return 'top-4 left-4';
    case 'bottom-right': return 'bottom-4 right-4';
    case 'bottom-left': return 'bottom-4 left-4';
    case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
    case 'bottom-center': return 'bottom-4 left-1/2 transform -translate-x-1/2';
    default: return 'bottom-4 right-4';
  }
}

function getTypeClasses(type: ToastType): string {
  switch (type) {
    case ToastType.SUCCESS: 
      return 'bg-green-50 text-green-800 border-l-4 border-green-500';
    case ToastType.ERROR:
      return 'bg-red-50 text-red-800 border-l-4 border-red-500';
    case ToastType.WARNING:
      return 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500';
    case ToastType.INFO:
      return 'bg-blue-50 text-blue-800 border-l-4 border-blue-500';
    default:
      return 'bg-gray-50 text-gray-800 border-l-4 border-gray-500';
  }
}

function getIconByType(type: ToastType): string {
  switch (type) {
    case ToastType.SUCCESS:
      return `
        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
      `;
    case ToastType.ERROR:
      return `
        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
      `;
    case ToastType.WARNING:
      return `
        <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
      `;
    case ToastType.INFO:
      return `
        <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
      `;
    default:
      return `
        <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
      `;
  }
}

// Shorthand methods
export function showSuccessToast(message: string, options: ToastOptions = {}) {
  showToast(message, ToastType.SUCCESS, options);
}

export function showErrorToast(message: string, options: ToastOptions = {}) {
  showToast(message, ToastType.ERROR, options);
}

export function showWarningToast(message: string, options: ToastOptions = {}) {
  showToast(message, ToastType.WARNING, options);
}

export function showInfoToast(message: string, options: ToastOptions = {}) {
  showToast(message, ToastType.INFO, options);
}
