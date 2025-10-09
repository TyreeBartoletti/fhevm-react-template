# fhEVM SDK Architecture

> Technical documentation for the fhEVM SDK design and implementation

## 🏗️ Project Structure

```
fhevm-sdk-monorepo/
├── packages/
│   └── fhevm-sdk/                # Universal SDK package
│       ├── src/
│       │   ├── types.ts          # TypeScript type definitions
│       │   ├── encryption.ts     # Encryption utilities
│       │   ├── decryption.ts     # Decryption utilities with EIP-712
│       │   ├── provider.ts       # Core provider class
│       │   ├── utils.ts          # Helper functions
│       │   ├── index.ts          # Main SDK exports
│       │   └── react/
│       │       ├── context.tsx   # React Context provider
│       │       ├── hooks.ts      # React hooks
│       │       └── index.ts      # React exports
│       ├── dist/                 # Compiled output
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── contracts/                    # Smart contracts (example)
│   └── CropYieldOptimizer.sol
│
├── scripts/                      # Deployment scripts
│   └── deploy.js
│
├── index.html                    # Example dApp frontend
├── package.json                  # Root workspace config
├── hardhat.config.js             # Hardhat configuration
├── README.md                     # Main documentation
└── ARCHITECTURE.md               # This file

```

## 🎯 Design Principles

### 1. **Framework Agnostic Core**

The core SDK (packages/fhevm-sdk/src/\*.ts) has no framework dependencies:

```typescript
// Core SDK works in any JavaScript environment
import { createProvider } from '@fhevm/sdk';

const provider = createProvider();
await provider.initialize(config);
const encrypted = await provider.encryptUint32(42);
```

### 2. **Optional React Layer**

React integration is provided as a separate export path:

```typescript
// React layer is completely optional
import { FHEProviderComponent, useEncryptUint32 } from '@fhevm/sdk/react';
```

This design allows:
- Vue, Angular, Svelte developers to use the core SDK
- React developers to use convenient hooks
- No forced dependencies on React

### 3. **Modular Architecture**

Each module has a single responsibility:

- **types.ts**: Type definitions only
- **encryption.ts**: Encryption operations
- **decryption.ts**: Decryption with EIP-712 signatures
- **provider.ts**: State management and orchestration
- **utils.ts**: Helper functions
- **react/**: React-specific code

## 🔧 Core Components

### FHEProvider Class

The central orchestrator for all FHE operations:

```typescript
class FHEProvider {
  // Initialization
  async initialize(config: FHEConfig): Promise<void>

  // Encryption methods
  async encryptBool(value: boolean): Promise<string>
  async encryptUint8(value: number): Promise<string>
  async encryptUint16(value: number): Promise<string>
  async encryptUint32(value: number): Promise<string>
  async encryptUint64(value: bigint): Promise<string>
  async encryptUint128(value: bigint): Promise<string>
  async encryptUint256(value: bigint): Promise<string>
  async encryptAddress(value: string): Promise<string>

  // Decryption methods
  async decrypt(request: DecryptRequest): Promise<DecryptResult>
  async publicDecrypt(handle: string): Promise<DecryptResult>

  // Utility methods
  getInstance(): FHEInstance
  getConfig(): FHEConfig
  isReady(): boolean
}
```

### Encryption Flow

```
User Input → Validate → fhevmjs.encrypt → Hex String → Smart Contract
```

Implementation:
1. User provides plaintext value
2. SDK validates type and range
3. fhevmjs library performs FHE encryption
4. Result is hex-encoded ciphertext
5. Ciphertext can be sent to smart contract

### Decryption Flow (userDecrypt)

```
Handle → EIP-712 Signature → Gateway Request → KMS Response → Plaintext
```

Implementation:
1. User requests decryption with ciphertext handle
2. SDK creates EIP-712 typed data structure
3. User signs with wallet (MetaMask)
4. Signature sent to Gateway contract
5. Gateway emits event for KMS nodes
6. KMS nodes return decryption shares
7. SDK aggregates and returns plaintext

### Decryption Flow (publicDecrypt)

```
Handle → Gateway Contract → Plaintext
```

Implementation:
1. User requests public decryption
2. SDK checks `isPublicDecryptAllowed(handle)`
3. If allowed, calls `getDecryptedValue(handle)`
4. Returns plaintext (no signature needed)

## ⚛️ React Integration

### Provider Pattern

```tsx
<FHEProviderComponent config={fheConfig}>
  <App />
</FHEProviderComponent>
```

The provider:
- Initializes FHE instance on mount
- Manages instance lifecycle
- Provides context to child components
- Handles errors gracefully

### Hook Pattern (Wagmi-like)

Each encryption type has its own hook:

```tsx
const { encrypt, isEncrypting, error } = useEncryptUint32();

// Usage
const encrypted = await encrypt(42);
```

Benefits:
- Type safety at compile time
- Loading states built-in
- Error handling included
- Familiar pattern for React developers

### Contract Interaction Hook

```tsx
const { contract, call, send } = useFHEContract(
  contractAddress,
  contractABI,
  signer
);

// Read operation
const value = await call('getValue');

// Write operation
const receipt = await send('setValue', encryptedValue);
```

## 🔐 Security Architecture

### EIP-712 Typed Data

All decryption requests use EIP-712 for security:

```typescript
{
  domain: {
    name: 'FHE Gateway',
    version: '2.0',
    chainId: 11155111,
    verifyingContract: '0xGatewayAddress'
  },
  types: {
    Decrypt: [
      { name: 'handle', type: 'uint256' },
      { name: 'contractAddress', type: 'address' },
      { name: 'userAddress', type: 'address' }
    ]
  },
  message: {
    handle: 'ciphertextHandle',
    contractAddress: '0xContractAddress',
    userAddress: '0xUserAddress'
  }
}
```

Benefits:
- User sees human-readable request in wallet
- Prevents signature replay attacks
- Binds decryption to specific contract and user

### Gateway v2.0 Features

The SDK is compatible with Gateway v2.0 specifications:

- ✅ `NUM_PAUSERS` configuration
- ✅ `PAUSER_ADDRESS_[N]` indexing (not array)
- ✅ `kmsGeneration` (not kmsManagement)
- ✅ `is...()` boolean functions (not `check...()`)
- ✅ Individual KMS node responses
- ✅ No on-chain aggregation
- ✅ sIND-CPAD transaction re-randomization

## 📦 Build System

### TypeScript Compilation

```bash
npm run build:sdk
```

Uses `tsup` for:
- ESM and CommonJS outputs
- Type declaration generation
- Source maps for debugging
- Tree-shaking support

### Workspace Management

```json
{
  "workspaces": ["packages/*", "examples/*"]
}
```

Benefits:
- Single `npm install` for entire monorepo
- Shared dependencies deduplicated
- Easy cross-package imports during development

### Smart Contract Integration

```bash
npm run build:contracts  # Compile Solidity
npm run deploy           # Deploy to network
```

Contracts and SDK share the same repository for consistency.

## 🚀 Usage Patterns

### Pattern 1: Vanilla JavaScript/TypeScript

```typescript
import { createProvider } from '@fhevm/sdk';

const provider = createProvider();
await provider.initialize({ chainId, gatewayAddress });

const encrypted = await provider.encryptUint32(42);
const result = await provider.decrypt({ handle, contractAddress, signer });
```

**Best for**: Node.js scripts, backend services, framework-agnostic code

### Pattern 2: React Hooks

```typescript
import { FHEProviderComponent, useEncryptUint32, useDecrypt } from '@fhevm/sdk/react';

function MyComponent() {
  const { encrypt } = useEncryptUint32();
  const { decrypt, result } = useDecrypt();

  const handleSubmit = async () => {
    const encrypted = await encrypt(42);
    // Send to contract...
  };
}
```

**Best for**: React applications, Next.js, Create React App

### Pattern 3: Contract Integration

```typescript
import { useFHEContract } from '@fhevm/sdk/react';

const { contract, send } = useFHEContract(address, abi, signer);

const submitData = async (encryptedValue) => {
  const receipt = await send('submitData', encryptedValue);
};
```

**Best for**: DApp frontends interacting with FHE contracts

## 🧪 Example Application

The agricultural platform demonstrates:

1. **Initialization**: Provider setup on page load
2. **Encryption**: Farm data encrypted before submission
3. **Contract Interaction**: Encrypted data sent to smart contract
4. **Decryption**: Private results retrieved with signatures
5. **Error Handling**: User-friendly error messages
6. **Loading States**: UI feedback during operations

File structure:
- `index.html`: Frontend using the SDK
- `contracts/`: FHE-enabled smart contracts
- `deploy.js`: Deployment script

## 🔄 Data Flow

```
┌─────────────┐
│   User UI   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   @fhevm/sdk    │ ← Core encryption/decryption logic
│   (Provider)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│    fhevmjs      │ ← Low-level FHE operations
│   (WASM lib)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Smart Contract │ ← FHE-enabled Solidity contract
│   (Blockchain)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Gateway + KMS  │ ← Decryption infrastructure
│   (Zama infra)  │
└─────────────────┘
```

## 📚 Type System

The SDK is fully typed with TypeScript:

```typescript
// Core types
FHEConfig      // Configuration options
FHEInstance    // Encryption instance interface
DecryptRequest // Decryption parameters
DecryptResult  // Decryption output
EncryptedValue // Encrypted data wrapper

// React types
FHEProviderContext // React context value
```

Benefits:
- IntelliSense in VS Code
- Compile-time error catching
- Self-documenting API
- Better developer experience

## 🎓 Design Decisions

### Why a Provider Class?

**Alternative**: Export individual functions

**Chosen**: Provider class pattern

**Reasons**:
- Encapsulates state (instance, config)
- Provides consistent API
- Easier to extend
- Familiar to React developers

### Why Separate React Package?

**Alternative**: Include React code in main exports

**Chosen**: Separate `@fhevm/sdk/react` export

**Reasons**:
- No forced React dependency
- Smaller bundle for non-React users
- Clear separation of concerns
- Can add Vue/Angular layers later

### Why EIP-712 for Decryption?

**Alternative**: Plain signatures

**Chosen**: EIP-712 typed data

**Reasons**:
- Better UX (readable in wallet)
- Industry standard (Uniswap, Opensea use it)
- Prevents replay attacks
- Domain separation

### Why Monorepo?

**Alternative**: Separate repos for SDK and example

**Chosen**: Single monorepo

**Reasons**:
- SDK and example stay in sync
- Single installation process
- Easier for judges to review
- Real-world best practice

## 🔮 Future Extensions

### Planned Features

1. **More Framework Adapters**
   - Vue composition API hooks
   - Angular services
   - Svelte stores

2. **Advanced Encryption**
   - Batch operations optimization
   - Streaming encryption for large data
   - Compression before encryption

3. **Developer Tools**
   - CLI for quick prototyping
   - Browser extension for debugging
   - Hardhat plugin for testing

4. **Additional Networks**
   - Mainnet support
   - Other EVM chains
   - L2 solutions

## 📖 References

- [Zama fhEVM Documentation](https://docs.zama.ai/)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react)
- [Wagmi Documentation](https://wagmi.sh/) (inspiration for API design)

---

**Architecture designed for the Zama SDK Design Competition** 🏆

*Built with care for the FHE developer community*
