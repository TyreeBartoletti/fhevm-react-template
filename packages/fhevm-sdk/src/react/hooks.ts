/**
 * React Hooks for FHE operations
 * Wagmi-like modular API structure
 */

import { useState, useCallback, useEffect } from 'react';
import { ethers, Signer } from 'ethers';
import { useFHEContext } from './context';
import { DecryptRequest, DecryptResult, EncryptedValue } from '../types';

/**
 * Hook to check if FHE provider is initialized
 */
export function useFHEInitialized(): boolean {
  const { isInitialized } = useFHEContext();
  return isInitialized;
}

/**
 * Hook to get the FHE instance
 */
export function useFHEInstance() {
  const { instance, isInitialized } = useFHEContext();

  if (!isInitialized || !instance) {
    throw new Error('FHE Provider not initialized');
  }

  return instance;
}

/**
 * Hook for encrypting boolean values
 */
export function useEncryptBool() {
  const instance = useFHEInstance();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: boolean): Promise<EncryptedValue | null> => {
      setIsEncrypting(true);
      setError(null);

      try {
        const data = await instance.encryptBool(value);
        return { data, type: 'ebool' };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook for encrypting uint8 values
 */
export function useEncryptUint8() {
  const instance = useFHEInstance();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number): Promise<EncryptedValue | null> => {
      setIsEncrypting(true);
      setError(null);

      try {
        const data = await instance.encryptUint8(value);
        return { data, type: 'euint8' };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook for encrypting uint16 values
 */
export function useEncryptUint16() {
  const instance = useFHEInstance();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number): Promise<EncryptedValue | null> => {
      setIsEncrypting(true);
      setError(null);

      try {
        const data = await instance.encryptUint16(value);
        return { data, type: 'euint16' };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook for encrypting uint32 values
 */
export function useEncryptUint32() {
  const instance = useFHEInstance();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number): Promise<EncryptedValue | null> => {
      setIsEncrypting(true);
      setError(null);

      try {
        const data = await instance.encryptUint32(value);
        return { data, type: 'euint32' };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook for encrypting uint64 values
 */
export function useEncryptUint64() {
  const instance = useFHEInstance();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: bigint): Promise<EncryptedValue | null> => {
      setIsEncrypting(true);
      setError(null);

      try {
        const data = await instance.encryptUint64(value);
        return { data, type: 'euint64' };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook for encrypting address values
 */
export function useEncryptAddress() {
  const instance = useFHEInstance();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: string): Promise<EncryptedValue | null> => {
      setIsEncrypting(true);
      setError(null);

      try {
        const data = await instance.encryptAddress(value);
        return { data, type: 'eaddress' };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook for decrypting values
 */
export function useDecrypt() {
  const { decrypt } = useFHEContext();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<DecryptResult | null>(null);

  const decryptValue = useCallback(
    async (request: DecryptRequest): Promise<DecryptResult | null> => {
      setIsDecrypting(true);
      setError(null);
      setResult(null);

      try {
        const decryptResult = await decrypt(request);
        setResult(decryptResult);
        return decryptResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [decrypt]
  );

  return { decrypt: decryptValue, isDecrypting, error, result };
}

/**
 * Hook for FHE contract interactions
 */
export function useFHEContract(
  contractAddress: string,
  abi: any[],
  signer?: Signer
) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!contractAddress || !abi) {
      return;
    }

    try {
      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );
      setContract(contractInstance);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setContract(null);
    }
  }, [contractAddress, abi, signer]);

  const call = useCallback(
    async (method: string, ...args: any[]) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      return contract[method](...args);
    },
    [contract]
  );

  const send = useCallback(
    async (method: string, ...args: any[]) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      const tx = await contract[method](...args);
      return tx.wait();
    },
    [contract]
  );

  return { contract, call, send, error };
}

/**
 * Hook for batch encryption
 */
export function useBatchEncrypt() {
  const instance = useFHEInstance();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encryptBatch = useCallback(
    async (
      values: Array<{ value: any; type: string }>
    ): Promise<EncryptedValue[] | null> => {
      setIsEncrypting(true);
      setError(null);

      try {
        const results: EncryptedValue[] = [];

        for (const { value, type } of values) {
          let data: string;

          switch (type) {
            case 'bool':
              data = await instance.encryptBool(value);
              results.push({ data, type: 'ebool' });
              break;
            case 'uint8':
              data = await instance.encryptUint8(value);
              results.push({ data, type: 'euint8' });
              break;
            case 'uint16':
              data = await instance.encryptUint16(value);
              results.push({ data, type: 'euint16' });
              break;
            case 'uint32':
              data = await instance.encryptUint32(value);
              results.push({ data, type: 'euint32' });
              break;
            case 'uint64':
              data = await instance.encryptUint64(value);
              results.push({ data, type: 'euint64' });
              break;
            case 'address':
              data = await instance.encryptAddress(value);
              results.push({ data, type: 'eaddress' });
              break;
            default:
              throw new Error(`Unsupported type: ${type}`);
          }
        }

        return results;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [instance]
  );

  return { encryptBatch, isEncrypting, error };
}
