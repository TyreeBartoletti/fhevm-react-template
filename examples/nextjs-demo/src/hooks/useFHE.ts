/**
 * useFHE Hook
 * Main hook for FHE operations
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { initializeFHE, isFHEInitialized, encryptValue, decryptValue } from '@/lib/fhe/client';
import type { FHEConfig, FHEType, EncryptedData, DecryptionResult } from '@/types/fhe';

interface UseFHEReturn {
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  initialize: (config: FHEConfig) => Promise<void>;
  encrypt: (value: any, type: FHEType) => Promise<EncryptedData | null>;
  decrypt: (handle: string, contractAddress: string, signer: any) => Promise<DecryptionResult | null>;
}

export function useFHE(): UseFHEReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsInitialized(isFHEInitialized());
  }, []);

  const initialize = useCallback(async (config: FHEConfig) => {
    if (isInitialized) {
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      await initializeFHE(config);
      setIsInitialized(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize FHE');
      setError(error);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [isInitialized]);

  const encrypt = useCallback(async (value: any, type: FHEType): Promise<EncryptedData | null> => {
    if (!isInitialized) {
      setError(new Error('FHE not initialized'));
      return null;
    }

    setError(null);

    try {
      const result = await encryptValue(value, type);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Encryption failed');
      setError(error);
      return null;
    }
  }, [isInitialized]);

  const decrypt = useCallback(async (
    handle: string,
    contractAddress: string,
    signer: any
  ): Promise<DecryptionResult | null> => {
    if (!isInitialized) {
      setError(new Error('FHE not initialized'));
      return null;
    }

    setError(null);

    try {
      const result = await decryptValue(handle, contractAddress, signer);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Decryption failed');
      setError(error);
      return null;
    }
  }, [isInitialized]);

  return {
    isInitialized,
    isInitializing,
    error,
    initialize,
    encrypt,
    decrypt,
  };
}
