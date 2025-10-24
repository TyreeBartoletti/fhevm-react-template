/**
 * Validation Utilities
 * Helper functions for validating FHE operations and inputs
 */

import type { FHEType } from '@/types/fhe';

/**
 * Validate if a value is within range for a given FHE type
 */
export function validateValueRange(value: number | bigint, type: FHEType): boolean {
  const numValue = typeof value === 'bigint' ? value : BigInt(value);

  switch (type) {
    case 'bool':
      return numValue === 0n || numValue === 1n;
    case 'uint8':
      return numValue >= 0n && numValue <= 255n;
    case 'uint16':
      return numValue >= 0n && numValue <= 65535n;
    case 'uint32':
      return numValue >= 0n && numValue <= 4294967295n;
    case 'uint64':
      return numValue >= 0n && numValue <= 18446744073709551615n;
    case 'uint128':
      return numValue >= 0n && numValue <= (2n ** 128n - 1n);
    case 'uint256':
      return numValue >= 0n && numValue <= (2n ** 256n - 1n);
    default:
      return false;
  }
}

/**
 * Validate Ethereum address format
 */
export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate encrypted data format
 */
export function validateEncryptedData(data: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(data) && data.length > 2;
}

/**
 * Validate FHE handle format
 */
export function validateHandle(handle: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(handle);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[^\w\s.-]/gi, '');
}

/**
 * Validate chain ID
 */
export function validateChainId(chainId: number): boolean {
  const validChainIds = [1, 5, 11155111]; // Mainnet, Goerli, Sepolia
  return validChainIds.includes(chainId);
}

/**
 * Check if value is numeric
 */
export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validate operation type
 */
export function validateOperation(operation: string): boolean {
  const validOperations = ['add', 'subtract', 'multiply', 'compare', 'and', 'or', 'xor'];
  return validOperations.includes(operation.toLowerCase());
}
