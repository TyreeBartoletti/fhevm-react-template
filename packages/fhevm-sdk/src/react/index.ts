/**
 * React exports for fhEVM SDK
 * Provides React-specific hooks and components
 */

// Export context and provider
export { FHEProviderComponent, useFHEContext } from './context';

// Export all hooks
export {
  useFHEInitialized,
  useFHEInstance,
  useEncryptBool,
  useEncryptUint8,
  useEncryptUint16,
  useEncryptUint32,
  useEncryptUint64,
  useEncryptAddress,
  useDecrypt,
  useFHEContract,
  useBatchEncrypt,
} from './hooks';

// Re-export types
export type {
  FHEConfig,
  FHEInstance,
  DecryptRequest,
  DecryptResult,
  EncryptedValue,
  FHEContractCall,
} from '../types';
