/**
 * Utility functions for FHE operations
 */

import { ethers } from 'ethers';

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate hex string format
 */
export function isValidHex(hex: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(hex);
}

/**
 * Convert number to hex string
 */
export function numberToHex(value: number | bigint): string {
  return '0x' + value.toString(16);
}

/**
 * Convert hex string to number
 */
export function hexToNumber(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Convert hex string to bigint
 */
export function hexToBigInt(hex: string): bigint {
  return BigInt(hex);
}

/**
 * Pad hex string to specific byte length
 */
export function padHex(hex: string, bytes: number): string {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const targetLength = bytes * 2;
  return '0x' + cleanHex.padStart(targetLength, '0');
}

/**
 * Check if a value is within uint8 range
 */
export function isUint8(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 255;
}

/**
 * Check if a value is within uint16 range
 */
export function isUint16(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 65535;
}

/**
 * Check if a value is within uint32 range
 */
export function isUint32(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 4294967295;
}

/**
 * Check if a value is within uint64 range
 */
export function isUint64(value: bigint): boolean {
  return value >= 0n && value <= 18446744073709551615n;
}

/**
 * Get the FHE type name from encrypted data
 */
export function getEncryptionType(encryptedData: string): string {
  // First byte indicates the type
  if (!isValidHex(encryptedData)) {
    throw new Error('Invalid encrypted data format');
  }

  const typeIndicator = encryptedData.slice(2, 4);

  const typeMap: { [key: string]: string } = {
    '00': 'ebool',
    '01': 'euint8',
    '02': 'euint16',
    '03': 'euint32',
    '04': 'euint64',
    '05': 'euint128',
    '06': 'euint256',
    '07': 'eaddress',
  };

  return typeMap[typeIndicator] || 'unknown';
}

/**
 * Format error messages for better debugging
 */
export function formatError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return JSON.stringify(error);
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  tx: ethers.ContractTransaction,
  confirmations: number = 1
): Promise<ethers.ContractReceipt> {
  return tx.wait(confirmations);
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  contract: ethers.Contract,
  method: string,
  args: any[]
): Promise<ethers.BigNumber> {
  return contract.estimateGas[method](...args);
}

/**
 * Get current gas price
 */
export async function getGasPrice(
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  return provider.getGasPrice();
}

/**
 * Format gas amount for display
 */
export function formatGas(gas: ethers.BigNumber): string {
  return ethers.utils.formatUnits(gas, 'gwei') + ' gwei';
}

/**
 * Format Ether amount for display
 */
export function formatEther(amount: ethers.BigNumber): string {
  return ethers.utils.formatEther(amount);
}

/**
 * Parse Ether amount from string
 */
export function parseEther(amount: string): ethers.BigNumber {
  return ethers.utils.parseEther(amount);
}

/**
 * Shorten address for display (0x1234...5678)
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}

/**
 * Create a delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
}

/**
 * Get the current network from provider
 */
export async function getNetwork(
  provider: ethers.providers.Provider
): Promise<ethers.providers.Network> {
  return provider.getNetwork();
}

/**
 * Validate chain ID matches expected network
 */
export async function validateChainId(
  provider: ethers.providers.Provider,
  expectedChainId: number
): Promise<boolean> {
  const network = await getNetwork(provider);
  return network.chainId === expectedChainId;
}
