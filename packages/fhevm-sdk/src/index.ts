/**
 * fhEVM SDK - Universal SDK for Fully Homomorphic Encryption on Ethereum
 *
 * This SDK provides a clean, modular API for working with Zama's fhEVM technology.
 * It supports encryption, decryption with EIP-712 signatures, and easy integration
 * with any Ethereum dApp.
 *
 * @module @fhevm/sdk
 */

// Export types
export type {
  FHEConfig,
  FHEInstance,
  DecryptRequest,
  DecryptResult,
  EIP712DecryptTypedData,
  FHEProviderContext,
  EncryptedValue,
  FHEContractCall,
  GatewayConfig,
  EncryptOptions,
} from './types';

// Export encryption utilities
export {
  createFHEInstance,
  encryptBool,
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptUint128,
  encryptUint256,
  encryptAddress,
  encryptBatch,
} from './encryption';

// Export decryption utilities
export {
  createDecryptTypedData,
  signDecryptRequest,
  requestUserDecrypt,
  publicDecrypt,
  waitForDecryptResult,
  parseDecryptedValue,
  getGatewayConfig,
  decrypt,
  decryptBatch,
} from './decryption';

// Export provider
export {
  FHEProvider,
  createProvider,
  getGlobalProvider,
  initializeGlobalProvider,
} from './provider';

// Export utility functions
export * from './utils';

/**
 * SDK version
 */
export const VERSION = '1.0.0';

/**
 * Default configurations for common networks
 */
export const DEFAULT_CONFIGS = {
  sepolia: {
    chainId: 11155111,
    gatewayAddress: '0x0000000000000000000000000000000000000000', // Replace with actual gateway
  },
  hardhat: {
    chainId: 31337,
    gatewayAddress: '0x0000000000000000000000000000000000000000', // Local development
  },
};
