export function loadNotFoundPage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
      <div class="text-center">
        <h1 class="text-9xl font-extrabold text-polygon-purple mb-4">404</h1>
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Page Not Found</h2>
        <p class="text-lg text-gray-600 max-w-md mx-auto mb-8">
          We couldn't find the page you're looking for. The page might have been moved or deleted.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#" id="goto-home" class="px-6 py-3 bg-polygon-purple hover:bg-polygon-dark text-white font-medium rounded-lg transition-colors duration-200">
            Go to Home
          </a>
          <a href="#" id="goto-dashboard" class="px-6 py-3 border border-polygon-purple text-polygon-purple bg-white hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  const homeButton = document.getElementById('goto-home');
  if (homeButton) {
    homeButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('activePage', 'home');
      window.dispatchEvent(new Event('navigate'));
    });
  }

  const dashboardButton = document.getElementById('goto-dashboard');
  if (dashboardButton) {
    dashboardButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('activePage', 'dashboard');
      window.dispatchEvent(new Event('navigate'));
    });
  }
}
