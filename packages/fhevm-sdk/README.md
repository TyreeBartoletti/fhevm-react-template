# @fhevm/sdk

> Universal SDK for Zama fhEVM - Fully Homomorphic Encryption for Ethereum

A clean, modular SDK for building privacy-preserving decentralized applications using Zama's Fully Homomorphic Encryption (FHE) technology on Ethereum.

## Features

- **Easy Initialization**: Simple setup with minimal configuration
- **Type-Safe Encryption**: Encrypt booleans, integers (8-256 bits), and addresses
- **EIP-712 Decryption**: Secure decryption using typed data signatures
- **React Integration**: Wagmi-like hooks for seamless React integration
- **Modular Architecture**: Use only what you need - core SDK works standalone
- **TypeScript Support**: Full type definitions included
- **Gateway v2.0 Compatible**: Latest FHE protocol specifications

## Installation

```bash
npm install @fhevm/sdk ethers@^5.7.0
```

For React applications:

```bash
npm install @fhevm/sdk @fhevm/sdk/react ethers@^5.7.0 react react-dom
```

## Quick Start

### Basic Usage (Vanilla JS/TS)

```typescript
import { createProvider } from '@fhevm/sdk';

// Initialize the provider
const provider = createProvider();
await provider.initialize({
  chainId: 11155111, // Sepolia testnet
  gatewayAddress: '0xYourGatewayAddress',
});

// Encrypt data
const encryptedValue = await provider.encryptUint32(42);

// Decrypt data (requires signer)
const result = await provider.decrypt({
  handle: 'ciphertextHandle',
  contractAddress: '0xYourContractAddress',
  signer: yourEthersSigner,
});

console.log('Decrypted value:', result.numberValue);
```

### React Usage

```tsx
import React from 'react';
import { FHEProviderComponent, useEncryptUint32, useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

function App() {
  const config = {
    chainId: 11155111,
    gatewayAddress: '0xYourGatewayAddress',
  };

  return (
    <FHEProviderComponent config={config} autoInitialize>
      <MyComponent />
    </FHEProviderComponent>
  );
}

function MyComponent() {
  const { encrypt, isEncrypting } = useEncryptUint32();
  const { decrypt, isDecrypting, result } = useDecrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42);
    console.log('Encrypted:', encrypted);
  };

  const handleDecrypt = async (signer: ethers.Signer) => {
    await decrypt({
      handle: 'ciphertextHandle',
      contractAddress: '0xYourContractAddress',
      signer,
    });
  };

  return (
    <div>
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        Encrypt
      </button>
      {result && <p>Decrypted: {result.numberValue}</p>}
    </div>
  );
}
```

## API Reference

### Core Provider

#### `createProvider()`

Creates a new FHE provider instance.

```typescript
import { createProvider } from '@fhevm/sdk';

const provider = createProvider();
```

#### `provider.initialize(config)`

Initializes the provider with configuration.

```typescript
await provider.initialize({
  chainId: 11155111,
  gatewayAddress: '0xGatewayAddress',
  aclAddress?: '0xACLAddress', // Optional
  kmsVerifierAddress?: '0xKMSAddress', // Optional
});
```

#### Encryption Methods

All encryption methods return a promise that resolves to the encrypted data as a hex string.

```typescript
// Boolean
await provider.encryptBool(true);

// Unsigned integers
await provider.encryptUint8(255);
await provider.encryptUint16(65535);
await provider.encryptUint32(4294967295);
await provider.encryptUint64(18446744073709551615n);
await provider.encryptUint128(BigInt('340282366920938463463374607431768211455'));
await provider.encryptUint256(BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935'));

// Ethereum address
await provider.encryptAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
```

#### `provider.decrypt(request)`

Decrypts a ciphertext using EIP-712 signature.

```typescript
const result = await provider.decrypt({
  handle: 'ciphertextHandle',
  contractAddress: '0xContractAddress',
  signer: ethersSigner,
});

// Access different formats
console.log(result.value); // string
console.log(result.numberValue); // number (if applicable)
console.log(result.bigintValue); // bigint (if applicable)
console.log(result.boolValue); // boolean (if applicable)
```

#### `provider.publicDecrypt(handle)`

Performs public decryption (no signature required).

```typescript
const result = await provider.publicDecrypt('ciphertextHandle');
```

### React Hooks

#### `FHEProviderComponent`

Wrap your app with this component to provide FHE functionality.

```tsx
<FHEProviderComponent
  config={fheConfig}
  provider={ethersProvider} // Optional
  autoInitialize={true} // Optional
>
  {children}
</FHEProviderComponent>
```

#### `useFHEInitialized()`

Check if the FHE provider is initialized.

```tsx
const isReady = useFHEInitialized();
```

#### Encryption Hooks

Each encryption hook returns `{ encrypt, isEncrypting, error }`.

```tsx
const { encrypt, isEncrypting, error } = useEncryptBool();
const { encrypt, isEncrypting, error } = useEncryptUint8();
const { encrypt, isEncrypting, error } = useEncryptUint16();
const { encrypt, isEncrypting, error } = useEncryptUint32();
const { encrypt, isEncrypting, error } = useEncryptUint64();
const { encrypt, isEncrypting, error } = useEncryptAddress();
```

#### `useDecrypt()`

Hook for decrypting values.

```tsx
const { decrypt, isDecrypting, error, result } = useDecrypt();

await decrypt({
  handle: 'ciphertextHandle',
  contractAddress: '0xContractAddress',
  signer: ethersSigner,
});
```

#### `useFHEContract(contractAddress, abi, signer)`

Hook for interacting with FHE-enabled smart contracts.

```tsx
const { contract, call, send, error } = useFHEContract(
  '0xContractAddress',
  contractABI,
  signer
);

// Read-only call
const value = await call('getValue');

// Transaction
const receipt = await send('setValue', encryptedValue);
```

#### `useBatchEncrypt()`

Hook for encrypting multiple values at once.

```tsx
const { encryptBatch, isEncrypting, error } = useBatchEncrypt();

const encrypted = await encryptBatch([
  { value: true, type: 'bool' },
  { value: 42, type: 'uint32' },
  { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', type: 'address' },
]);
```

## Utility Functions

```typescript
import {
  isValidAddress,
  isValidHex,
  numberToHex,
  hexToNumber,
  hexToBigInt,
  padHex,
  shortenAddress,
  retry,
  delay,
} from '@fhevm/sdk';

// Validate Ethereum address
isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'); // true

// Shorten address for display
shortenAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'); // "0x742d...0bEb"

// Retry with exponential backoff
await retry(async () => {
  // Your async operation
}, 3, 1000);
```

## Examples

See the [examples/crop-optimizer](../../examples/crop-optimizer) directory for a complete example application demonstrating:

- Farm registration
- Encrypted data submission
- Collaborative analysis
- Private result retrieval

## Advanced Usage

### Custom Gateway Configuration

```typescript
import { getGatewayConfig } from '@fhevm/sdk';

const gatewayInfo = await provider.getGatewayInfo();
console.log('Number of pausers:', gatewayInfo.numPausers);
console.log('KMS generation:', gatewayInfo.kmsGeneration);
```

### Batch Operations

```typescript
import { encryptBatch, decryptBatch } from '@fhevm/sdk';

// Batch encrypt
const values = [
  { value: 100, type: 'uint32' },
  { value: 200, type: 'uint32' },
  { value: 300, type: 'uint32' },
];

const encrypted = await encryptBatch(provider.getInstance(), values);

// Batch decrypt
const handles = ['handle1', 'handle2', 'handle3'];
const results = await decryptBatch(
  handles,
  signer,
  contractAddress,
  chainId,
  gatewayAddress,
  ethersProvider
);
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions.

```typescript
import type {
  FHEConfig,
  FHEInstance,
  DecryptRequest,
  DecryptResult,
  EncryptedValue,
  GatewayConfig,
} from '@fhevm/sdk';
```

## Security Considerations

- **EIP-712 Signatures**: All user decryption requests require EIP-712 signatures
- **Access Control**: Ensure your smart contracts implement proper access control
- **Handle Management**: Keep ciphertext handles secure and don't expose them publicly unless intended
- **Gateway Trust**: The gateway contract is a critical component - verify its address

## Browser Compatibility

The SDK works in all modern browsers that support:
- WebAssembly
- ES6+
- Async/await
- BigInt

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please open issues and pull requests on GitHub.

## Support

- **Documentation**: [https://docs.zama.ai/](https://docs.zama.ai/)
- **GitHub Issues**: [Report bugs or request features](https://github.com/TyreeBartoletti/fheCropYieldOptimizer/issues)
- **Zama Community**: Join the Zama Discord for community support

---

Built with ❤️ for the Zama FHE community
