/**
 * Core type definitions for fhEVM SDK
 */

import { Signer } from 'ethers';

/**
 * Configuration for initializing the FHE SDK
 */
export interface FHEConfig {
  /** The network chain ID */
  chainId: number;
  /** Gateway contract address for decryption */
  gatewayAddress: string;
  /** Optional ACL contract address */
  aclAddress?: string;
  /** Optional KMS verifier address */
  kmsVerifierAddress?: string;
}

/**
 * FHE SDK instance interface
 */
export interface FHEInstance {
  /** Encrypt a boolean value */
  encryptBool(value: boolean): Promise<string>;
  /** Encrypt an 8-bit unsigned integer */
  encryptUint8(value: number): Promise<string>;
  /** Encrypt a 16-bit unsigned integer */
  encryptUint16(value: number): Promise<string>;
  /** Encrypt a 32-bit unsigned integer */
  encryptUint32(value: number): Promise<string>;
  /** Encrypt a 64-bit unsigned integer */
  encryptUint64(value: bigint): Promise<string>;
  /** Encrypt a 128-bit unsigned integer */
  encryptUint128(value: bigint): Promise<string>;
  /** Encrypt a 256-bit unsigned integer */
  encryptUint256(value: bigint): Promise<string>;
  /** Encrypt an address */
  encryptAddress(value: string): Promise<string>;
}

/**
 * Decryption request parameters
 */
export interface DecryptRequest {
  /** The contract address containing the encrypted data */
  contractAddress: string;
  /** The handle (ciphertext ID) to decrypt */
  handle: string;
  /** The signer to sign the EIP-712 message */
  signer: Signer;
}

/**
 * EIP-712 typed data for user decryption
 */
export interface EIP712DecryptTypedData {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: {
    Decrypt: Array<{ name: string; type: string }>;
  };
  message: {
    handle: string;
    contractAddress: string;
    userAddress: string;
  };
}

/**
 * Public decryption result
 */
export interface DecryptResult {
  /** The decrypted value as a string */
  value: string;
  /** The decrypted value as a number (if applicable) */
  numberValue?: number;
  /** The decrypted value as a bigint (if applicable) */
  bigintValue?: bigint;
  /** The decrypted value as a boolean (if applicable) */
  boolValue?: boolean;
}

/**
 * FHE provider context
 */
export interface FHEProviderContext {
  /** The FHE instance for encryption operations */
  instance: FHEInstance | null;
  /** Whether the SDK is initialized */
  isInitialized: boolean;
  /** Configuration object */
  config: FHEConfig | null;
  /** Initialize the FHE instance */
  initialize: (config: FHEConfig) => Promise<void>;
  /** Decrypt a ciphertext handle */
  decrypt: (request: DecryptRequest) => Promise<DecryptResult>;
}

/**
 * Encrypted value metadata
 */
export interface EncryptedValue {
  /** The encrypted data as hex string */
  data: string;
  /** The encryption type (ebool, euint8, etc.) */
  type: string;
  /** Optional handle/ciphertext ID after submission */
  handle?: string;
}

/**
 * Contract call parameters for FHE operations
 */
export interface FHEContractCall {
  /** Contract address */
  address: string;
  /** Contract ABI */
  abi: any[];
  /** Function name to call */
  functionName: string;
  /** Function arguments */
  args?: any[];
  /** Signer to execute the transaction */
  signer: Signer;
}

/**
 * Gateway configuration for decryption
 */
export interface GatewayConfig {
  /** Gateway contract address */
  address: string;
  /** Number of pausers configured */
  numPausers?: number;
  /** Current KMS generation */
  kmsGeneration?: number;
  /** Whether public decryption is allowed */
  isPublicDecryptAllowed?: boolean;
}

/**
 * Encryption options
 */
export interface EncryptOptions {
  /** Optional user address for access control */
  userAddress?: string;
  /** Optional contract address for access control */
  contractAddress?: string;
}
