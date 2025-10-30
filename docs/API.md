# fhEVM SDK API Documentation

## Table of Contents

- [Core SDK API](#core-sdk-api)
- [React Hooks API](#react-hooks-api)
- [TypeScript Types](#typescript-types)
- [Configuration](#configuration)

---

## Core SDK API

### `createProvider()`

Creates a new FHE provider instance.

**Returns**: `FHEProvider`

**Example**:
```typescript
import { createProvider } from '@fhevm/sdk';

const provider = createProvider();
```

---

### `FHEProvider.initialize(config: FHEConfig)`

Initializes the FHE instance with network configuration.

**Parameters**:
- `config: FHEConfig` - Configuration object containing:
  - `chainId: number` - The blockchain network chain ID
  - `gatewayAddress: string` - The FHE gateway contract address

**Returns**: `Promise<void>`

**Example**:
```typescript
await provider.initialize({
  chainId: 11155111, // Sepolia
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
});
```

---

## Encryption Methods

All encryption methods return `Promise<EncryptedValue>` containing the encrypted data.

### `encryptBool(value: boolean)`

Encrypts a boolean value.

**Example**:
```typescript
const encrypted = await provider.encryptBool(true);
console.log(encrypted.data); // "0x..." hex string
```

### `encryptUint8(value: number)`

Encrypts an 8-bit unsigned integer (0-255).

**Example**:
```typescript
const encrypted = await provider.encryptUint8(42);
```

### `encryptUint16(value: number)`

Encrypts a 16-bit unsigned integer (0-65535).

**Example**:
```typescript
const encrypted = await provider.encryptUint16(1000);
```

### `encryptUint32(value: number)`

Encrypts a 32-bit unsigned integer.

**Example**:
```typescript
const encrypted = await provider.encryptUint32(1000000);
```

### `encryptUint64(value: bigint)`

Encrypts a 64-bit unsigned integer.

**Example**:
```typescript
const encrypted = await provider.encryptUint64(BigInt("9007199254740991"));
```

### `encryptUint128(value: bigint)`

Encrypts a 128-bit unsigned integer.

**Example**:
```typescript
const encrypted = await provider.encryptUint128(BigInt("340282366920938463463374607431768211455"));
```

### `encryptUint256(value: bigint)`

Encrypts a 256-bit unsigned integer.

**Example**:
```typescript
const encrypted = await provider.encryptUint256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));
```

### `encryptAddress(address: string)`

Encrypts an Ethereum address.

**Example**:
```typescript
const encrypted = await provider.encryptAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
```

---

## Decryption Methods

### `userDecrypt(request: DecryptRequest)`

Decrypts a ciphertext with EIP-712 signature authorization.

**Parameters**:
- `request: DecryptRequest` - Object containing:
  - `handle: string` - The ciphertext handle from contract
  - `contractAddress: string` - The contract address
  - `signer: Signer` - Ethers.js signer for signature

**Returns**: `Promise<DecryptResult>`

**Example**:
```typescript
const result = await provider.userDecrypt({
  handle: await contract.getEncryptedValue(),
  contractAddress: contract.address,
  signer: ethersSigner
});

console.log(result.value); // String representation
console.log(result.numberValue); // Numeric value (if applicable)
console.log(result.boolValue); // Boolean value (if applicable)
```

### `publicDecrypt(request: DecryptRequest)`

Decrypts a public ciphertext (no signature required).

**Parameters**:
- `request: DecryptRequest` - Object containing:
  - `handle: string` - The ciphertext handle
  - `contractAddress: string` - The contract address

**Returns**: `Promise<DecryptResult>`

**Example**:
```typescript
const result = await provider.publicDecrypt({
  handle: publicHandle,
  contractAddress: contract.address
});
```

---

## React Hooks API

All hooks must be used within `<FHEProviderComponent>`.

### `FHEProviderComponent`

Context provider that initializes FHE for React applications.

**Props**:
- `config: FHEConfig` - FHE configuration
- `autoInitialize?: boolean` - Auto-initialize on mount (default: true)
- `children: ReactNode` - Child components

**Example**:
```tsx
import { FHEProviderComponent } from '@fhevm/sdk/react';

function App() {
  return (
    <FHEProviderComponent
      config={{
        chainId: 11155111,
        gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
      }}
      autoInitialize
    >
      <YourApp />
    </FHEProviderComponent>
  );
}
```

---

### Encryption Hooks

All encryption hooks follow the same pattern:

**Returns**:
```typescript
{
  encrypt: (value: T) => Promise<EncryptedValue>,
  isEncrypting: boolean,
  error: Error | null,
  result: EncryptedValue | null
}
```

#### `useEncryptBool()`

```tsx
const { encrypt, isEncrypting, error, result } = useEncryptBool();

const handleEncrypt = async () => {
  const encrypted = await encrypt(true);
};
```

#### `useEncryptUint8()`

```tsx
const { encrypt } = useEncryptUint8();
const encrypted = await encrypt(42);
```

#### `useEncryptUint16()`

```tsx
const { encrypt } = useEncryptUint16();
const encrypted = await encrypt(1000);
```

#### `useEncryptUint32()`

```tsx
const { encrypt } = useEncryptUint32();
const encrypted = await encrypt(1000000);
```

#### `useEncryptUint64()`

```tsx
const { encrypt } = useEncryptUint64();
const encrypted = await encrypt(BigInt("123456789"));
```

#### `useEncryptAddress()`

```tsx
const { encrypt } = useEncryptAddress();
const encrypted = await encrypt("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
```

---

### Decryption Hooks

#### `useDecrypt()`

Decrypts ciphertext with EIP-712 signature.

**Returns**:
```typescript
{
  decrypt: (params: DecryptRequest) => Promise<void>,
  isDecrypting: boolean,
  error: Error | null,
  result: {
    value: string,
    numberValue?: number,
    boolValue?: boolean
  } | null
}
```

**Example**:
```tsx
import { useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

function DecryptComponent() {
  const { decrypt, result, isDecrypting } = useDecrypt();

  const handleDecrypt = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    await decrypt({
      handle: ciphertextHandle,
      contractAddress: '0x...',
      signer
    });

    console.log(result?.numberValue);
  };

  return (
    <button onClick={handleDecrypt} disabled={isDecrypting}>
      {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
    </button>
  );
}
```

#### `usePublicDecrypt()`

Decrypts public ciphertext without signature.

---

### Utility Hooks

#### `useFHEInitialized()`

Checks if FHE instance is ready.

**Returns**: `boolean`

**Example**:
```tsx
const isReady = useFHEInitialized();

if (!isReady) {
  return <div>Initializing FHE...</div>;
}
```

#### `useFHEInstance()`

Gets the current FHE instance.

**Returns**: `FHEInstance | null`

#### `useFHEContract(address: string, abi: any)`

Creates a type-safe contract interface with FHE support.

**Example**:
```tsx
const contract = useFHEContract(contractAddress, contractABI);
```

---

## TypeScript Types

### `FHEConfig`

```typescript
interface FHEConfig {
  chainId: number;
  gatewayAddress: string;
}
```

### `EncryptedValue`

```typescript
interface EncryptedValue {
  data: string; // Hex-encoded ciphertext
  type?: string; // FHE type (bool, uint8, uint16, etc.)
}
```

### `DecryptRequest`

```typescript
interface DecryptRequest {
  handle: string;
  contractAddress: string;
  signer?: Signer; // Required for userDecrypt, optional for publicDecrypt
}
```

### `DecryptResult`

```typescript
interface DecryptResult {
  value: string;
  numberValue?: number;
  boolValue?: boolean;
}
```

---

## Configuration

### Network Configurations

#### Sepolia Testnet
```typescript
{
  chainId: 11155111,
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
}
```

#### Local Development
```typescript
{
  chainId: 31337,
  gatewayAddress: '0x...' // Your local gateway address
}
```

---

## Error Handling

All SDK methods can throw errors. Always wrap calls in try-catch:

```typescript
try {
  const encrypted = await provider.encryptUint32(42);
  await contract.submitValue(encrypted.data);
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error appropriately
}
```

---

## Best Practices

1. **Initialize Once**: Only initialize FHE provider once at app startup
2. **Type Safety**: Use TypeScript for better development experience
3. **Error Handling**: Always handle potential errors
4. **Validation**: Validate inputs before encryption
5. **Security**: Never log sensitive encrypted data
6. **Testing**: Test on testnet before mainnet deployment

---

## Support

For issues or questions:
- GitHub Issues: [Report a bug](https://github.com/your-repo/issues)
- Documentation: [Full docs](../README.md)
- Examples: [See examples](../examples/)
