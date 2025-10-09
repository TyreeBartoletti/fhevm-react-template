/**
 * React Context for FHE Provider
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { FHEConfig, FHEProviderContext, DecryptRequest, DecryptResult } from '../types';
import { FHEProvider } from '../provider';

/**
 * Default context value
 */
const defaultContext: FHEProviderContext = {
  instance: null,
  isInitialized: false,
  config: null,
  initialize: async () => {
    throw new Error('FHE Provider not initialized');
  },
  decrypt: async () => {
    throw new Error('FHE Provider not initialized');
  },
};

/**
 * FHE Provider React Context
 */
export const FHEContext = createContext<FHEProviderContext>(defaultContext);

/**
 * Props for FHEProviderComponent
 */
interface FHEProviderProps {
  children: ReactNode;
  config?: FHEConfig;
  provider?: ethers.providers.Provider;
  autoInitialize?: boolean;
}

/**
 * FHE Provider Component
 * Wrap your app with this component to provide FHE functionality
 */
export function FHEProviderComponent({
  children,
  config,
  provider,
  autoInitialize = false,
}: FHEProviderProps) {
  const [fheProvider] = useState(() => new FHEProvider());
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<FHEConfig | null>(config || null);

  /**
   * Initialize the FHE provider
   */
  const initialize = useCallback(
    async (newConfig: FHEConfig) => {
      if (isInitialized) {
        fheProvider.reset();
      }

      await fheProvider.initialize(newConfig, provider);
      setCurrentConfig(newConfig);
      setIsInitialized(true);
    },
    [fheProvider, provider, isInitialized]
  );

  /**
   * Decrypt a ciphertext
   */
  const decrypt = useCallback(
    async (request: DecryptRequest): Promise<DecryptResult> => {
      if (!isInitialized) {
        throw new Error('FHE Provider not initialized. Call initialize() first.');
      }
      return fheProvider.decrypt(request);
    },
    [fheProvider, isInitialized]
  );

  /**
   * Auto-initialize if config is provided
   */
  React.useEffect(() => {
    if (autoInitialize && config && !isInitialized) {
      initialize(config).catch((error) => {
        console.error('Failed to auto-initialize FHE Provider:', error);
      });
    }
  }, [autoInitialize, config, isInitialized, initialize]);

  const contextValue: FHEProviderContext = {
    instance: isInitialized ? fheProvider.getInstance() : null,
    isInitialized,
    config: currentConfig,
    initialize,
    decrypt,
  };

  return <FHEContext.Provider value={contextValue}>{children}</FHEContext.Provider>;
}

/**
 * Hook to access FHE context
 */
export function useFHEContext(): FHEProviderContext {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProviderComponent');
  }
  return context;
}
