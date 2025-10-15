/**
 * FHE Provider
 * Core provider class for managing FHE instance and configuration
 */

import { ethers } from 'ethers';
import { FHEConfig, FHEInstance, DecryptRequest, DecryptResult } from './types';
import { createFHEInstance } from './encryption';
import { decrypt, publicDecrypt, getGatewayConfig } from './decryption';

/**
 * Main FHE Provider class
 */
export class FHEProvider {
  private instance: FHEInstance | null = null;
  private config: FHEConfig | null = null;
  private provider: ethers.providers.Provider | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialize the FHE provider with configuration
   */
  async initialize(
    config: FHEConfig,
    provider?: ethers.providers.Provider
  ): Promise<void> {
    if (this.isInitialized) {
      throw new Error('FHE Provider is already initialized');
    }

    this.config = config;
    this.provider = provider || null;

    // Create the FHE instance for encryption
    this.instance = await createFHEInstance(config);

    this.isInitialized = true;
  }

  /**
   * Get the FHE instance
   */
  getInstance(): FHEInstance {
    if (!this.instance) {
      throw new Error('FHE Provider not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  /**
   * Get the configuration
   */
  getConfig(): FHEConfig {
    if (!this.config) {
      throw new Error('FHE Provider not initialized. Call initialize() first.');
    }
    return this.config;
  }

  /**
   * Set the provider for blockchain interactions
   */
  setProvider(provider: ethers.providers.Provider): void {
    this.provider = provider;
  }

  /**
   * Get the current provider
   */
  getProvider(): ethers.providers.Provider {
    if (!this.provider) {
      throw new Error('No provider set. Call setProvider() first.');
    }
    return this.provider;
  }

  /**
   * Check if provider is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.instance !== null;
  }

  /**
   * Encrypt a boolean value
   */
  async encryptBool(value: boolean): Promise<string> {
    const instance = this.getInstance();
    return instance.encryptBool(value);
  }

  /**
   * Encrypt an 8-bit unsigned integer
   */
  async encryptUint8(value: number): Promise<string> {
    const instance = this.getInstance();
    return instance.encryptUint8(value);
  }

  /**
   * Encrypt a 16-bit unsigned integer
   */
  async encryptUint16(value: number): Promise<string> {
    const instance = this.getInstance();
    return instance.encryptUint16(value);
  }

  /**
   * Encrypt a 32-bit unsigned integer
   */
  async encryptUint32(value: number): Promise<string> {
    const instance = this.getInstance();
    return instance.encryptUint32(value);
  }

  /**
   * Encrypt a 64-bit unsigned integer
   */
  async encryptUint64(value: bigint): Promise<string> {
    const instance = this.getInstance();
    return instance.encryptUint64(value);
  }

  /**
   * Encrypt a 128-bit unsigned integer
   */
  async encryptUint128(value: bigint): Promise<string> {
    const instance = this.getInstance();
    return instance.encryptUint128(value);
  }

  /**
   * Encrypt a 256-bit unsigned integer
   */
  async encryptUint256(value: bigint): Promise<string> {
    const instance = this.getInstance();
    return instance.encryptUint256(value);
  }

  /**
   * Encrypt an Ethereum address
   */
  async encryptAddress(value: string): Promise<string> {
    const instance = this.getInstance();
    return instance.encryptAddress(value);
  }

  /**
   * Decrypt a ciphertext using EIP-712 signature
   */
  async decrypt(request: DecryptRequest): Promise<DecryptResult> {
    const config = this.getConfig();
    const provider = this.getProvider();

    return decrypt(
      request,
      config.chainId,
      config.gatewayAddress,
      provider
    );
  }

  /**
   * Perform public decryption (no signature required)
   */
  async publicDecrypt(handle: string): Promise<DecryptResult> {
    const config = this.getConfig();
    const provider = this.getProvider();

    return publicDecrypt(config.gatewayAddress, handle, provider);
  }

  /**
   * Get gateway configuration information
   */
  async getGatewayInfo() {
    const config = this.getConfig();
    const provider = this.getProvider();

    return getGatewayConfig(config.gatewayAddress, provider);
  }

  /**
   * Reset the provider
   */
  reset(): void {
    this.instance = null;
    this.config = null;
    this.provider = null;
    this.isInitialized = false;
  }
}

/**
 * Create a new FHE Provider instance
 */
export function createProvider(): FHEProvider {
  return new FHEProvider();
}

/**
 * Global singleton provider instance
 */
let globalProvider: FHEProvider | null = null;

/**
 * Get or create the global provider instance
 */
export function getGlobalProvider(): FHEProvider {
  if (!globalProvider) {
    globalProvider = new FHEProvider();
  }
  return globalProvider;
}

/**
 * Initialize the global provider
 */
export async function initializeGlobalProvider(
  config: FHEConfig,
  provider?: ethers.providers.Provider
): Promise<FHEProvider> {
  const fheProvider = getGlobalProvider();
  await fheProvider.initialize(config, provider);
  return fheProvider;
}
