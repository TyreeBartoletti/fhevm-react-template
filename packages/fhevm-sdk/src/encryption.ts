/**
 * FHE Encryption utilities
 * Provides functions for encrypting various data types for fhEVM
 */

import { FHEConfig, FHEInstance, EncryptedValue, EncryptOptions } from './types';

/**
 * Initialize FHE instance with configuration
 */
export async function createFHEInstance(config: FHEConfig): Promise<FHEInstance> {
  // Import fhevmjs dynamically to avoid bundling issues
  const fhevmjs = await import('fhevmjs');

  const instance = await fhevmjs.createInstance({
    chainId: config.chainId,
    gatewayUrl: config.gatewayAddress,
    aclAddress: config.aclAddress,
    kmsVerifierAddress: config.kmsVerifierAddress,
  });

  return {
    encryptBool: async (value: boolean): Promise<string> => {
      const encrypted = instance.encrypt_bool(value);
      return '0x' + Buffer.from(encrypted).toString('hex');
    },

    encryptUint8: async (value: number): Promise<string> => {
      if (value < 0 || value > 255) {
        throw new Error('Value must be between 0 and 255 for uint8');
      }
      const encrypted = instance.encrypt_uint8(value);
      return '0x' + Buffer.from(encrypted).toString('hex');
    },

    encryptUint16: async (value: number): Promise<string> => {
      if (value < 0 || value > 65535) {
        throw new Error('Value must be between 0 and 65535 for uint16');
      }
      const encrypted = instance.encrypt_uint16(value);
      return '0x' + Buffer.from(encrypted).toString('hex');
    },

    encryptUint32: async (value: number): Promise<string> => {
      if (value < 0 || value > 4294967295) {
        throw new Error('Value must be between 0 and 4294967295 for uint32');
      }
      const encrypted = instance.encrypt_uint32(value);
      return '0x' + Buffer.from(encrypted).toString('hex');
    },

    encryptUint64: async (value: bigint): Promise<string> => {
      if (value < 0n || value > 18446744073709551615n) {
        throw new Error('Value must be between 0 and 2^64-1 for uint64');
      }
      const encrypted = instance.encrypt_uint64(value);
      return '0x' + Buffer.from(encrypted).toString('hex');
    },

    encryptUint128: async (value: bigint): Promise<string> => {
      if (value < 0n || value > (2n ** 128n - 1n)) {
        throw new Error('Value must be between 0 and 2^128-1 for uint128');
      }
      const encrypted = instance.encrypt_uint128(value);
      return '0x' + Buffer.from(encrypted).toString('hex');
    },

    encryptUint256: async (value: bigint): Promise<string> => {
      if (value < 0n || value > (2n ** 256n - 1n)) {
        throw new Error('Value must be between 0 and 2^256-1 for uint256');
      }
      const encrypted = instance.encrypt_uint256(value);
      return '0x' + Buffer.from(encrypted).toString('hex');
    },

    encryptAddress: async (value: string): Promise<string> => {
      // Validate Ethereum address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
        throw new Error('Invalid Ethereum address format');
      }
      const encrypted = instance.encrypt_address(value);
      return '0x' + Buffer.from(encrypted).toString('hex');
    },
  };
}

/**
 * Encrypt a boolean value
 */
export async function encryptBool(
  instance: FHEInstance,
  value: boolean,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  const data = await instance.encryptBool(value);
  return {
    data,
    type: 'ebool',
  };
}

/**
 * Encrypt an 8-bit unsigned integer
 */
export async function encryptUint8(
  instance: FHEInstance,
  value: number,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  const data = await instance.encryptUint8(value);
  return {
    data,
    type: 'euint8',
  };
}

/**
 * Encrypt a 16-bit unsigned integer
 */
export async function encryptUint16(
  instance: FHEInstance,
  value: number,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  const data = await instance.encryptUint16(value);
  return {
    data,
    type: 'euint16',
  };
}

/**
 * Encrypt a 32-bit unsigned integer
 */
export async function encryptUint32(
  instance: FHEInstance,
  value: number,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  const data = await instance.encryptUint32(value);
  return {
    data,
    type: 'euint32',
  };
}

/**
 * Encrypt a 64-bit unsigned integer
 */
export async function encryptUint64(
  instance: FHEInstance,
  value: bigint,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  const data = await instance.encryptUint64(value);
  return {
    data,
    type: 'euint64',
  };
}

/**
 * Encrypt a 128-bit unsigned integer
 */
export async function encryptUint128(
  instance: FHEInstance,
  value: bigint,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  const data = await instance.encryptUint128(value);
  return {
    data,
    type: 'euint128',
  };
}

/**
 * Encrypt a 256-bit unsigned integer
 */
export async function encryptUint256(
  instance: FHEInstance,
  value: bigint,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  const data = await instance.encryptUint256(value);
  return {
    data,
    type: 'euint256',
  };
}

/**
 * Encrypt an Ethereum address
 */
export async function encryptAddress(
  instance: FHEInstance,
  value: string,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  const data = await instance.encryptAddress(value);
  return {
    data,
    type: 'eaddress',
  };
}

/**
 * Batch encrypt multiple values
 */
export async function encryptBatch(
  instance: FHEInstance,
  values: Array<{ value: any; type: string }>,
  options?: EncryptOptions
): Promise<EncryptedValue[]> {
  const results: EncryptedValue[] = [];

  for (const { value, type } of values) {
    let encrypted: EncryptedValue;

    switch (type) {
      case 'bool':
        encrypted = await encryptBool(instance, value, options);
        break;
      case 'uint8':
        encrypted = await encryptUint8(instance, value, options);
        break;
      case 'uint16':
        encrypted = await encryptUint16(instance, value, options);
        break;
      case 'uint32':
        encrypted = await encryptUint32(instance, value, options);
        break;
      case 'uint64':
        encrypted = await encryptUint64(instance, value, options);
        break;
      case 'uint128':
        encrypted = await encryptUint128(instance, value, options);
        break;
      case 'uint256':
        encrypted = await encryptUint256(instance, value, options);
        break;
      case 'address':
        encrypted = await encryptAddress(instance, value, options);
        break;
      default:
        throw new Error(`Unsupported encryption type: ${type}`);
    }

    results.push(encrypted);
  }

  return results;
}
