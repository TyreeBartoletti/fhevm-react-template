/**
 * FHE Provider Component
 * Context provider for FHE operations
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFHE } from '@/hooks/useFHE';
import type { FHEConfig, FHEContextValue } from '@/types/fhe';

const FHEContext = createContext<FHEContextValue | null>(null);

interface FHEProviderProps {
  config: FHEConfig;
  autoInitialize?: boolean;
  children: React.ReactNode;
}

export function FHEProvider({ config, autoInitialize = true, children }: FHEProviderProps) {
  const { isInitialized, isInitializing, error, initialize, encrypt, decrypt } = useFHE();
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    if (autoInitialize && !isInitialized && !isInitializing) {
      initialize(config).catch((err) => {
        console.error('Failed to initialize FHE:', err);
        setInitError(err);
      });
    }
  }, [autoInitialize, config, initialize, isInitialized, isInitializing]);

  const contextValue: FHEContextValue = {
    isInitialized,
    config: isInitialized ? config : null,
    encrypt,
    decrypt,
    compute: async () => {
      throw new Error('Compute operation should be performed on-chain');
    },
  };

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">FHE Initialization Error</h2>
          <p className="text-gray-700">{initError.message}</p>
          <button
            onClick={() => {
              setInitError(null);
              initialize(config);
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (autoInitialize && !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Initializing FHE...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we set up encryption</p>
        </div>
      </div>
    );
  }

  return (
    <FHEContext.Provider value={contextValue}>
      {children}
    </FHEContext.Provider>
  );
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
}
