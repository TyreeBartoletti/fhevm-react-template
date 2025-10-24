/**
 * useEncryption Hook
 * Specialized hook for encryption operations
 */

'use client';

import { useState, useCallback } from 'react';
import { useFHE } from './useFHE';
import type { FHEType, EncryptedData } from '@/types/fhe';

interface UseEncryptionReturn {
  encrypt: (value: any, type: FHEType) => Promise<EncryptedData | null>;
  encryptedData: EncryptedData | null;
  isEncrypting: boolean;
  error: Error | null;
  reset: () => void;
}

export function useEncryption(): UseEncryptionReturn {
  const { encrypt: fheEncrypt, isInitialized } = useFHE();
  const [encryptedData, setEncryptedData] = useState<EncryptedData | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(async (value: any, type: FHEType): Promise<EncryptedData | null> => {
    if (!isInitialized) {
      const err = new Error('FHE not initialized');
      setError(err);
      return null;
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const result = await fheEncrypt(value, type);
      setEncryptedData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Encryption failed');
      setError(error);
      return null;
    } finally {
      setIsEncrypting(false);
    }
  }, [fheEncrypt, isInitialized]);

  const reset = useCallback(() => {
    setEncryptedData(null);
    setError(null);
    setIsEncrypting(false);
  }, []);

  return {
    encrypt,
    encryptedData,
    isEncrypting,
    error,
    reset,
  };
}
