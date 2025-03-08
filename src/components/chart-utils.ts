/**
 * Utility functions for Chart.js based visualizations
 */

export function initNetworkGrowthChart(
  elementId: string, 
  dates: string[], 
  counts: number[]
): void {
  const ctx = document.getElementById(elementId) as HTMLCanvasElement;
  if (!ctx) {
    console.error(`Canvas element with ID ${elementId} not found`);
    return;
  }

  if (!window.Chart) {
    console.error("Chart.js library not loaded");
    const container = ctx.parentElement;
    if (container) {
      container.innerHTML = `
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <p>Chart library not loaded. Please refresh the page.</p>
        </div>
      `;
    }
    return;
  }

  try {
    // Check if we have data to display
    if (!dates.length || !counts.length) {
      const container = ctx.parentElement;
      if (container) {
        container.innerHTML = `
          <div class="p-4 bg-gray-50 rounded-lg text-center">
            <p>No registration data available yet.</p>
          </div>
        `;
      }
      return;
    }

    // Create a new chart instance
    new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'User Registrations',
          data: counts,
          fill: false,
          borderColor: '#8247e5',
          backgroundColor: 'rgba(130, 71, 229, 0.1)',
          tension: 0.1,
          pointBackgroundColor: '#8247e5',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            },
            title: {
              display: true,
              text: 'Number of Registrations'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  } catch (error) {
    console.error("Error initializing chart:", error);
    const container = ctx.parentElement;
    if (container) {
      container.innerHTML = `
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <p>Error creating chart visualization. Please try again later.</p>
        </div>
      `;
    }
  }
}

// Helper function to check if Chart.js is available
export function isChartLibraryLoaded(): boolean {
  return typeof window.Chart !== 'undefined';
}

// Add Chart.js typing for TypeScript
declare global {
  interface Window {
    Chart: any;
  }
}
