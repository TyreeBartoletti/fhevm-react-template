/**
 * API Types and Interfaces
 * Type definitions for API requests and responses
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptRequest {
  value: string | number | boolean;
  type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address';
}

export interface EncryptResponse {
  encrypted: string;
  type: string;
  handle?: string;
}

export interface DecryptRequest {
  handle: string;
  contractAddress: string;
  signature?: string;
}

export interface DecryptResponse {
  decrypted: string;
  value: string | number | boolean;
}

export interface KeyGenerationRequest {
  userId: string;
  keyType: 'public' | 'private' | 'reencryption';
}

export interface KeyGenerationResponse {
  publicKey: string;
  keyId: string;
  timestamp: number;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, any>;
}
