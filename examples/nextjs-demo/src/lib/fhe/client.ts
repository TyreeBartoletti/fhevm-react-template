/**
 * Client-side FHE Operations
 * Handles encryption and decryption on the client side
 */

import { createProvider } from '@fhevm/sdk';
import type { EncryptedData, FHEConfig, FHEType } from '@/types/fhe';

let fheProvider: ReturnType<typeof createProvider> | null = null;

/**
 * Initialize FHE provider with configuration
 */
export async function initializeFHE(config: FHEConfig): Promise<void> {
  if (fheProvider) {
    console.log('FHE provider already initialized');
    return;
  }

  try {
    fheProvider = createProvider();
    await fheProvider.initialize({
      chainId: config.chainId,
      gatewayAddress: config.gatewayAddress,
    });
    console.log('FHE provider initialized successfully');
  } catch (error) {
    console.error('Failed to initialize FHE provider:', error);
    throw new Error('FHE initialization failed');
  }
}

/**
 * Get the initialized FHE provider
 */
export function getFHEProvider() {
  if (!fheProvider) {
    throw new Error('FHE provider not initialized. Call initializeFHE first.');
  }
  return fheProvider;
}

/**
 * Check if FHE provider is initialized
 */
export function isFHEInitialized(): boolean {
  return fheProvider !== null;
}

/**
 * Encrypt a value using FHE
 */
export async function encryptValue(value: any, type: FHEType): Promise<EncryptedData> {
  const provider = getFHEProvider();

  try {
    let result;

    switch (type) {
      case 'bool':
        result = await provider.encryptBool(Boolean(value));
        break;
      case 'uint8':
        result = await provider.encryptUint8(Number(value));
        break;
      case 'uint16':
        result = await provider.encryptUint16(Number(value));
        break;
      case 'uint32':
        result = await provider.encryptUint32(Number(value));
        break;
      case 'uint64':
        result = await provider.encryptUint64(BigInt(value));
        break;
      case 'uint128':
        result = await provider.encryptUint128(BigInt(value));
        break;
      case 'uint256':
        result = await provider.encryptUint256(BigInt(value));
        break;
      case 'address':
        result = await provider.encryptAddress(String(value));
        break;
      default:
        throw new Error(`Unsupported encryption type: ${type}`);
    }

    return {
      data: result.data,
      type,
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error(`Failed to encrypt ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt a value using FHE with EIP-712 signature
 */
export async function decryptValue(
  handle: string,
  contractAddress: string,
  signer: any
): Promise<any> {
  const provider = getFHEProvider();

  try {
    const result = await provider.userDecrypt({
      handle,
      contractAddress,
      signer,
    });

    return result;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error(`Failed to decrypt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Reset FHE provider
 */
export function resetFHE(): void {
  fheProvider = null;
}
