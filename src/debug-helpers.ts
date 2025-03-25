/**
 * Debug helpers for blockchain MLM application
 * This file contains utility functions to help with debugging
 */

// Enable this flag to turn on verbose logging
const DEBUG_MODE = process.env.NODE_ENV !== 'production';

/**
 * Log messages when in debug mode
 */
export function debugLog(...args: any[]): void {
  if (DEBUG_MODE) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Log error messages
 */
export function debugError(...args: any[]): void {
  if (DEBUG_MODE) {
    console.error('[ERROR]', ...args);
  }
}

/**
 * Format and log transaction data
 */
export function logTransaction(tx: any): void {
  if (!DEBUG_MODE) return;
  
  console.group('Transaction Details');
  console.log('Hash:', tx.hash || tx.transactionHash);
  console.log('From:', tx.from);
  console.log('To:', tx.to);
  console.log('Value:', tx.value?.toString());
  console.log('Gas Used:', tx.gasUsed?.toString());
  console.groupEnd();
}

/**
 * Attach debugging utilities to window for console access
 */
if (DEBUG_MODE) {
  (window as any).debugUtils = {
    debugLog,
    debugError,
    logTransaction
  };
  
  console.log('Debug helpers loaded. Access via window.debugUtils');
}
