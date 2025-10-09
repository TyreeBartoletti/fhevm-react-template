/**
 * FHE Decryption utilities
 * Provides functions for decrypting FHE ciphertexts using EIP-712 signatures
 */

import { ethers, Signer } from 'ethers';
import { DecryptRequest, DecryptResult, EIP712DecryptTypedData, GatewayConfig } from './types';

/**
 * Create EIP-712 typed data for user decryption
 */
export function createDecryptTypedData(
  chainId: number,
  gatewayAddress: string,
  handle: string,
  contractAddress: string,
  userAddress: string
): EIP712DecryptTypedData {
  return {
    domain: {
      name: 'FHE Gateway',
      version: '2.0',
      chainId,
      verifyingContract: gatewayAddress,
    },
    types: {
      Decrypt: [
        { name: 'handle', type: 'uint256' },
        { name: 'contractAddress', type: 'address' },
        { name: 'userAddress', type: 'address' },
      ],
    },
    message: {
      handle,
      contractAddress,
      userAddress,
    },
  };
}

/**
 * Sign decryption request using EIP-712
 */
export async function signDecryptRequest(
  signer: Signer,
  chainId: number,
  gatewayAddress: string,
  handle: string,
  contractAddress: string
): Promise<string> {
  const userAddress = await signer.getAddress();

  const typedData = createDecryptTypedData(
    chainId,
    gatewayAddress,
    handle,
    contractAddress,
    userAddress
  );

  // Sign the typed data
  const signature = await signer._signTypedData(
    typedData.domain,
    typedData.types,
    typedData.message
  );

  return signature;
}

/**
 * Request decryption from the gateway (userDecrypt)
 * Uses EIP-712 signature for authorization
 */
export async function requestUserDecrypt(
  request: DecryptRequest,
  chainId: number,
  gatewayAddress: string
): Promise<string> {
  const signature = await signDecryptRequest(
    request.signer,
    chainId,
    gatewayAddress,
    request.handle,
    request.contractAddress
  );

  // The signature is submitted to the gateway contract
  // The gateway will emit an event that KMS nodes listen to
  // KMS nodes will respond with their individual decryption shares
  return signature;
}

/**
 * Perform public decryption (no signature required)
 * Used for publicly accessible encrypted values
 */
export async function publicDecrypt(
  gatewayAddress: string,
  handle: string,
  provider: ethers.providers.Provider
): Promise<DecryptResult> {
  // Gateway contract ABI for public decryption
  const gatewayABI = [
    'function isPublicDecryptAllowed(uint256 handle) external view returns (bool)',
    'function getDecryptedValue(uint256 handle) external view returns (uint256)',
  ];

  const gateway = new ethers.Contract(gatewayAddress, gatewayABI, provider);

  // Check if public decryption is allowed for this handle
  const isAllowed = await gateway.isPublicDecryptAllowed(handle);
  if (!isAllowed) {
    throw new Error('Public decryption not allowed for this handle');
  }

  // Get the decrypted value
  const decryptedValue = await gateway.getDecryptedValue(handle);

  return parseDecryptedValue(decryptedValue.toString());
}

/**
 * Wait for decryption result after requesting userDecrypt
 */
export async function waitForDecryptResult(
  gatewayAddress: string,
  handle: string,
  provider: ethers.providers.Provider,
  timeout: number = 30000
): Promise<DecryptResult> {
  const gatewayABI = [
    'function getDecryptedValue(uint256 handle) external view returns (uint256)',
    'event DecryptionResponse(uint256 indexed handle, uint256 value)',
  ];

  const gateway = new ethers.Contract(gatewayAddress, gatewayABI, provider);

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      gateway.removeAllListeners('DecryptionResponse');
      reject(new Error('Decryption timeout'));
    }, timeout);

    // Listen for the decryption response event
    gateway.on('DecryptionResponse', async (eventHandle: ethers.BigNumber, value: ethers.BigNumber) => {
      if (eventHandle.toString() === handle) {
        clearTimeout(timeoutId);
        gateway.removeAllListeners('DecryptionResponse');

        const result = parseDecryptedValue(value.toString());
        resolve(result);
      }
    });
  });
}

/**
 * Parse decrypted value into different formats
 */
export function parseDecryptedValue(value: string): DecryptResult {
  const result: DecryptResult = {
    value,
  };

  // Try to parse as number
  try {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num.toString() === value) {
      result.numberValue = num;

      // Check if it's a boolean (0 or 1)
      if (num === 0 || num === 1) {
        result.boolValue = num === 1;
      }
    }
  } catch (e) {
    // Not a valid number
  }

  // Try to parse as bigint for large values
  try {
    const bigintVal = BigInt(value);
    result.bigintValue = bigintVal;
  } catch (e) {
    // Not a valid bigint
  }

  return result;
}

/**
 * Get gateway configuration
 */
export async function getGatewayConfig(
  gatewayAddress: string,
  provider: ethers.providers.Provider
): Promise<GatewayConfig> {
  const gatewayABI = [
    'function NUM_PAUSERS() external view returns (uint256)',
    'function kmsGeneration() external view returns (uint256)',
    'function isPublicDecryptAllowed(uint256 handle) external view returns (bool)',
  ];

  const gateway = new ethers.Contract(gatewayAddress, gatewayABI, provider);

  try {
    const numPausers = await gateway.NUM_PAUSERS();
    const kmsGen = await gateway.kmsGeneration();

    return {
      address: gatewayAddress,
      numPausers: numPausers.toNumber(),
      kmsGeneration: kmsGen.toNumber(),
    };
  } catch (error) {
    // Gateway might not have these functions
    return {
      address: gatewayAddress,
    };
  }
}

/**
 * Complete decryption flow: request + wait for result
 */
export async function decrypt(
  request: DecryptRequest,
  chainId: number,
  gatewayAddress: string,
  provider: ethers.providers.Provider
): Promise<DecryptResult> {
  // Request decryption with EIP-712 signature
  await requestUserDecrypt(request, chainId, gatewayAddress);

  // Wait for KMS nodes to respond and return the result
  const result = await waitForDecryptResult(
    gatewayAddress,
    request.handle,
    provider
  );

  return result;
}

/**
 * Batch decrypt multiple handles
 */
export async function decryptBatch(
  handles: string[],
  signer: Signer,
  contractAddress: string,
  chainId: number,
  gatewayAddress: string,
  provider: ethers.providers.Provider
): Promise<DecryptResult[]> {
  const results: DecryptResult[] = [];

  for (const handle of handles) {
    const request: DecryptRequest = {
      contractAddress,
      handle,
      signer,
    };

    const result = await decrypt(request, chainId, gatewayAddress, provider);
    results.push(result);
  }

  return results;
}
