/**
 * FHE Types and Interfaces
 * Type definitions for Fully Homomorphic Encryption operations
 */

export type FHEType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address';

export interface EncryptedData {
  data: string;
  type: FHEType;
  handle?: string;
}

export interface DecryptionRequest {
  handle: string;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptionResult {
  value: string;
  numberValue?: number;
  boolValue?: boolean;
}

export interface FHEConfig {
  chainId: number;
  gatewayAddress: string;
  networkUrl?: string;
}

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operand1: string;
  operand2: string;
  type: FHEType;
}

export interface ComputationResult {
  result: string;
  operation: string;
}

export interface FHEContextValue {
  isInitialized: boolean;
  config: FHEConfig | null;
  encrypt: (value: any, type: FHEType) => Promise<EncryptedData>;
  decrypt: (request: DecryptionRequest) => Promise<DecryptionResult>;
  compute: (request: ComputationRequest) => Promise<ComputationResult>;
}
