// Chart utilities for network growth visualization

/**
 * Check if the Chart.js library is loaded
 */
export function isChartLibraryLoaded(): boolean {
  return typeof Chart !== 'undefined';
}

/**
 * Initialize a network growth chart
 * @param canvasId - The ID of the canvas element
 * @param labels - The date labels for the chart
 * @param data - The data points for the chart
 */
export function initNetworkGrowthChart(canvasId: string, labels: string[], data: number[]): void {
  if (!isChartLibraryLoaded()) {
    console.error('Chart.js library not loaded');
    return;
  }

  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    console.error(`Canvas element with ID ${canvasId} not found`);
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  // @ts-ignore - Chart is loaded globally
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'New Registrations',
          data,
          borderColor: '#8247e5',
          backgroundColor: 'rgba(130, 71, 229, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}

/**
 * Initialize a level distribution chart (donut/pie chart)
 * @param canvasId - The ID of the canvas element
 * @param labels - The level labels
 * @param data - The count of users at each level
 */
export function initLevelDistributionChart(canvasId: string, labels: string[], data: number[]): void {
  if (!isChartLibraryLoaded()) {
    console.error('Chart.js library not loaded');
    return;
  }

  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    console.error(`Canvas element with ID ${canvasId} not found`);
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  // Colors for each level
  const backgroundColors = [
    '#8247e5', // Polygon Purple
    '#a06cf9', // Polygon Light
    '#6037c1', // Polygon Dark
    '#e2d6ff', // Polygon Ultralight
    '#10b981', // Success Green
    '#f59e0b', // Warning Orange
    '#ef4444', // Error Red
    '#1e293b', // Dark Blue
  ];

  // @ts-ignore - Chart is loaded globally
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: 'white',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
      },
    },
  });
}
