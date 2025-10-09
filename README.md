# fhEVM SDK - Universal TypeScript SDK for Zama

> **Framework-Agnostic SDK for Fully Homomorphic Encryption on Ethereum**
>
> Built for the Zama fhEVM SDK Design Competition

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tyreebartoletti.github.io/fheCropYieldOptimizer/)
[![Next.js Template](https://img.shields.io/badge/Next.js-14-black)](./examples/nextjs-demo/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Network](https://img.shields.io/badge/network-Sepolia-purple)](https://sepolia.etherscan.io/)

---

## 🎯 What is fhEVM SDK?

**fhEVM SDK** is a production-ready, universal TypeScript library that makes Fully Homomorphic Encryption (FHE) accessible to every JavaScript developer. Whether you're building with Next.js, React, Vue, or vanilla JavaScript, this SDK provides a simple, type-safe interface to Zama's fhEVM technology.

### Why This SDK?

- 🚀 **Developer-First**: Wagmi-like API that web3 developers already know
- 🎨 **Framework Agnostic**: Works everywhere JavaScript runs
- 🔒 **Type-Safe**: Full TypeScript support with IntelliSense
- 📦 **Modular**: Use only what you need - core SDK or with React hooks
- 🛠️ **Production Ready**: Tested, documented, and deployed live

---

## 📦 SDK Architecture

### Three-Layer Design

```
┌─────────────────────────────────────────────────────┐
│  React Hooks Layer (Optional)                       │
│  • useEncryptUint32()  • useDecrypt()               │
│  • useFHEContract()    • useFHEInitialized()        │
├─────────────────────────────────────────────────────┤
│  Core SDK (Framework-Agnostic)                      │
│  • createProvider()    • encrypt methods            │
│  • decrypt methods     • contract helpers           │
├─────────────────────────────────────────────────────┤
│  fhevmjs + Gateway v2.0                             │
│  • FHE encryption      • EIP-712 signatures         │
└─────────────────────────────────────────────────────┘
```

### Key Features

- ✅ **Easy Initialization**: One-line provider setup
- ✅ **All FHE Types**: bool, uint8, uint16, uint32, uint64, uint128, uint256, address
- ✅ **EIP-712 Decryption**: Secure signature-based authorization
- ✅ **Wagmi-like Hooks**: Familiar API for React developers
- ✅ **Gateway v2.0**: Latest protocol support
- ✅ **Full TypeScript**: Complete type safety

---

## 🚀 Quick Start

### Installation

```bash
npm install @fhevm/sdk
# or
yarn add @fhevm/sdk
```

### Vanilla JavaScript/TypeScript

```typescript
import { createProvider } from '@fhevm/sdk';

// Initialize provider
const provider = createProvider();
await provider.initialize({
  chainId: 11155111,
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
});

// Encrypt data
const encrypted = await provider.encryptUint32(42);

// Use in contract call
await contract.submitValue(encrypted.data);
```

### React / Next.js

```tsx
import { FHEProviderComponent, useEncryptUint32 } from '@fhevm/sdk/react';

// Wrap your app
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

// Use hooks in components
function EncryptComponent() {
  const { encrypt, isEncrypting } = useEncryptUint32();

  const handleEncrypt = async () => {
    const result = await encrypt(42);
    console.log(result.data); // Encrypted ciphertext
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
    </button>
  );
}
```

### Decryption with EIP-712

```typescript
import { useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

function DecryptComponent() {
  const { decrypt, result, isDecrypting } = useDecrypt();

  const handleDecrypt = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    await decrypt({
      handle: 'ciphertextHandle', // From contract
      contractAddress: '0xYourContract...',
      signer
    });

    console.log(result.numberValue); // Decrypted value
  };

  return <button onClick={handleDecrypt}>Decrypt</button>;
}
```

---

## 📚 Available Hooks

All React hooks follow the Wagmi pattern for consistency:

### Encryption Hooks
- `useEncryptBool(value)` - Encrypt boolean values
- `useEncryptUint8(value)` - Encrypt 8-bit unsigned integers
- `useEncryptUint16(value)` - Encrypt 16-bit unsigned integers
- `useEncryptUint32(value)` - Encrypt 32-bit unsigned integers
- `useEncryptUint64(value)` - Encrypt 64-bit unsigned integers
- `useEncryptUint128(value)` - Encrypt 128-bit unsigned integers
- `useEncryptUint256(value)` - Encrypt 256-bit unsigned integers
- `useEncryptAddress(address)` - Encrypt Ethereum addresses

### Decryption Hooks
- `useDecrypt()` - Decrypt with EIP-712 signature
- `usePublicDecrypt()` - Decrypt public values

### Utility Hooks
- `useFHEInitialized()` - Check FHE instance readiness
- `useFHEContract(address, abi)` - Create type-safe contract interface

---

## 🎨 Examples & Templates

### 1. Next.js Template (Required for Competition) ✅

Complete Next.js 14 application demonstrating all SDK features:

- **Location**: [`examples/nextjs-demo/`](./examples/nextjs-demo/)
- **Features**:
  - App Router with React Server & Client Components
  - All encryption/decryption examples
  - MetaMask wallet integration
  - Professional UI with loading states
  - Full TypeScript support
  - Responsive design

**Start the demo:**
```bash
npm run dev:nextjs
# Opens at http://localhost:3000
```

[**📖 Next.js Template Documentation →**](./examples/nextjs-demo/README.md)

### 2. Vanilla HTML/JS Demo (Live)

Real-world application showing privacy-preserving agricultural collaboration:

- **Live Demo**: [https://tyreebartoletti.github.io/fheCropYieldOptimizer/](https://tyreebartoletti.github.io/fheCropYieldOptimizer/)
- **Use Case**: Multiple farms collaborate on encrypted yield optimization
- **Contract**: `0xf2301736A15a5152401E968cB8d995c0F508f568` on Sepolia
- **Features**: Farm registration, encrypted data submission, FHE computation

**Start locally:**
```bash
npm start
# Opens at http://localhost:3000
```

---

## 🏗️ Monorepo Structure

This project uses npm workspaces for efficient development:

```
fhevm-sdk-monorepo/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   ├── react/          # React hooks & providers
│       │   └── types/          # TypeScript definitions
│       ├── package.json
│       └── README.md           # SDK documentation
│
├── examples/
│   └── nextjs-demo/            # Next.js 14 template (Required)
│       ├── app/                # App Router structure
│       ├── package.json
│       └── README.md
│
├── contracts/                  # Smart contracts
│   └── ConfidentialYieldOptimizer.sol
│
├── scripts/                    # Deployment scripts
│   └── deploy.js
│
├── package.json                # Root workspace config
├── README.md                   # This file
└── demo.mp4                    # Video demonstration
```

---

## 🛠️ Development

### Install All Dependencies

```bash
npm install
```

### Build SDK

```bash
npm run build:sdk
```

This compiles both core and React packages.

### Compile Contracts

```bash
npm run build:contracts
```

### Deploy Contracts

```bash
npm run deploy
```

### Run Tests

```bash
npm test
```

---

## 🎯 Competition Requirements

This submission fulfills all Zama SDK Design Competition requirements:

| Requirement | Status | Location |
|------------|--------|----------|
| Universal SDK Package | ✅ | `packages/fhevm-sdk/` |
| Framework-Agnostic Core | ✅ | `packages/fhevm-sdk/src/core/` |
| React Integration | ✅ | `packages/fhevm-sdk/src/react/` |
| **Next.js Template** | ✅ | `examples/nextjs-demo/` |
| Initialization Utilities | ✅ | `createProvider()` |
| Encryption Methods | ✅ | All FHE types supported |
| Decryption with EIP-712 | ✅ | `userDecrypt`, `publicDecrypt` |
| Wagmi-like API | ✅ | React hooks pattern |
| TypeScript Support | ✅ | Full type definitions |
| Monorepo Structure | ✅ | npm workspaces |
| Root-Level Commands | ✅ | All scripts in root |
| Documentation | ✅ | Complete README & guides |
| Live Demo | ✅ | Deployed application |
| Video Demo | ✅ | `demo.mp4` |

---

## 📖 API Documentation

### Core SDK API

#### `createProvider()`

Creates a new FHE provider instance.

```typescript
import { createProvider } from '@fhevm/sdk';

const provider = createProvider();
```

#### `provider.initialize(config)`

Initializes the FHE instance with network configuration.

```typescript
await provider.initialize({
  chainId: 11155111,
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
});
```

#### Encryption Methods

All encryption methods return `Promise<EncryptedData>`:

```typescript
// Encrypt different types
const boolResult = await provider.encryptBool(true);
const uint8Result = await provider.encryptUint8(42);
const uint32Result = await provider.encryptUint32(1000000);
const addressResult = await provider.encryptAddress('0x...');

// Access encrypted data
console.log(boolResult.data); // "0x..." hex string
```

#### Decryption Methods

```typescript
// User decrypt (requires signature)
const result = await provider.userDecrypt({
  handle: 'ciphertextHandle',
  contractAddress: '0x...',
  signer: ethersSigner
});

// Public decrypt (no signature)
const publicResult = await provider.publicDecrypt({
  handle: 'publicHandle',
  contractAddress: '0x...'
});
```

### React Hooks API

All hooks return consistent interfaces:

```typescript
// Encryption hooks
const {
  encrypt,           // Function to encrypt value
  isEncrypting,      // Loading state
  error,             // Error object if failed
  result             // Encrypted result
} = useEncryptUint32();

// Decryption hook
const {
  decrypt,           // Function to decrypt
  isDecrypting,      // Loading state
  error,             // Error object if failed
  result: {
    value,           // String representation
    numberValue,     // Numeric value (if applicable)
    boolValue        // Boolean value (if applicable)
  }
} = useDecrypt();

// Initialization hook
const isReady = useFHEInitialized();
```

[**📘 Complete API Reference →**](./packages/fhevm-sdk/README.md)

---

## 🔐 Security Considerations

### Client-Side Encryption

All encryption happens in the browser before data is sent to the blockchain. Your plaintext data never leaves the client.

### EIP-712 Signatures

Decryption requires user signature following EIP-712 standard, ensuring only authorized parties can decrypt values.

### Gateway v2.0 Protocol

This SDK implements the latest Gateway v2.0 specifications:
- Dynamic pauser management
- KMS generation tracking
- Individual node responses
- No on-chain aggregation

### Best Practices

1. **Never log encrypted data** - Ciphertexts are sensitive
2. **Validate inputs** - Check values before encryption
3. **Handle errors gracefully** - Network requests can fail
4. **Use proper types** - TypeScript helps prevent mistakes
5. **Test thoroughly** - Verify on testnet before mainnet

---

## 🌐 Deployment

### Live Deployments

- **Demo Application**: [https://tyreebartoletti.github.io/fheCropYieldOptimizer/](https://tyreebartoletti.github.io/fheCropYieldOptimizer/)
- **Smart Contract**: [`0xf2301736A15a5152401E968cB8d995c0F508f568`](https://sepolia.etherscan.io/address/0xf2301736A15a5152401E968cB8d995c0F508f568)
- **Network**: Ethereum Sepolia Testnet
- **Gateway**: `0x33347831500F1e73f102414fAf8fD6b494F06a10`

### Deploy Your Own

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your private key and RPC URL
   ```

3. Deploy contract:
   ```bash
   npm run deploy
   ```

4. Update frontend config with your contract address

---

## 📹 Video Demonstration

A 3-minute video walkthrough is included in this repository:

- **File**: `demo.mp4`
- **Content**:
  - SDK installation and setup
  - Next.js integration walkthrough
  - Live encryption/decryption demo
  - Design decisions and architecture
  - Real-world use case demonstration

---

## 🎓 Tutorial: Build Your First FHE App

### Step 1: Install SDK

```bash
npm install @fhevm/sdk ethers
```

### Step 2: Initialize Provider

```typescript
import { createProvider } from '@fhevm/sdk';

const provider = createProvider();
await provider.initialize({
  chainId: 11155111,
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
});
```

### Step 3: Encrypt Data

```typescript
const encrypted = await provider.encryptUint32(42);
```

### Step 4: Submit to Contract

```typescript
import { ethers } from 'ethers';

const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);

await contract.submitValue(encrypted.data);
```

### Step 5: Decrypt Result

```typescript
const result = await provider.userDecrypt({
  handle: await contract.getEncryptedResult(),
  contractAddress: contract.address,
  signer
});

console.log('Decrypted value:', result.numberValue);
```

[**📘 Complete Tutorial →**](./docs/TUTORIAL.md)

---

## 🤝 Contributing

We welcome contributions! This SDK is open source and community-driven.

### Ways to Contribute

- 🐛 **Report Bugs**: Open an issue with reproduction steps
- 💡 **Suggest Features**: Share ideas for improvements
- 📝 **Improve Docs**: Help make documentation clearer
- 🔧 **Submit PRs**: Fix bugs or add features
- ⭐ **Star the Repo**: Show your support!

### Development Setup

```bash
# Clone repository
git clone https://github.com/TyreeBartoletti/fheCropYieldOptimizer.git
cd fheCropYieldOptimizer

# Install dependencies
npm install

# Build SDK
npm run build:sdk

# Run tests
npm test

# Start development
npm run dev:sdk
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zama**: For pioneering FHE technology and hosting this competition
- **Ethereum Foundation**: For providing the infrastructure
- **fhevmjs Contributors**: For the core FHE library
- **Community**: For feedback and support

---

## 📞 Support & Resources

### Documentation
- [SDK Documentation](./packages/fhevm-sdk/README.md)
- [Next.js Template Guide](./examples/nextjs-demo/README.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./packages/fhevm-sdk/API.md)

### Links
- **GitHub**: [https://github.com/TyreeBartoletti/fheCropYieldOptimizer](https://github.com/TyreeBartoletti/fheCropYieldOptimizer)
- **Live Demo**: [https://tyreebartoletti.github.io/fheCropYieldOptimizer/](https://tyreebartoletti.github.io/fheCropYieldOptimizer/)
- **Zama Docs**: [https://docs.zama.ai/](https://docs.zama.ai/)
- **fhEVM Docs**: [https://docs.fhevm.zama.ai/](https://docs.fhevm.zama.ai/)

### Community
- Open an issue on GitHub
- Join the discussion
- Check the FAQ

---

## 🌟 Why Choose fhEVM SDK?

### For Developers
- ⚡ **Fast Integration**: Get started in minutes, not hours
- 🎯 **Familiar API**: If you know Wagmi, you know this SDK
- 📚 **Great Docs**: Every feature explained with examples
- 🔍 **Type Safety**: Catch errors before runtime
- 🧪 **Well Tested**: Production-ready code

### For Projects
- 🏗️ **Flexible**: Works with your stack
- 📦 **Modular**: Use only what you need
- 🚀 **Production Ready**: Deployed and proven
- 🔒 **Secure**: Best practices built-in
- 🌍 **Community Driven**: Open source, collaborative

---

**Built with ❤️ for the Zama fhEVM ecosystem**

*Making privacy-preserving blockchain applications accessible to every developer*
