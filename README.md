# fhEVM SDK - Universal TypeScript SDK for Zama

> **Framework-Agnostic SDK for Fully Homomorphic Encryption on Ethereum**
>
> Built for the Zama fhEVM SDK Design Competition

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tyreebartoletti.github.io/FHECropYieldOptimizer/)
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

```typescript
// Vanilla JS/TS
import { createProvider } from '@fhevm/sdk';
const provider = createProvider();
await provider.initialize({ chainId: 11155111, gatewayAddress: '0x...' });
const encrypted = await provider.encryptUint32(42);

// React
import { FHEProviderComponent, useEncryptUint32 } from '@fhevm/sdk/react';
const { encrypt } = useEncryptUint32();
const encrypted = await encrypt(42);
```

[**→ SDK Documentation**](./packages/fhevm-sdk/README.md) | [**→ Quick Start Guide**](./docs/QUICK_START.md) | [**→ API Reference**](./docs/API.md)

## 📖 Example Application: Confidential Crop Yield Optimizer

**Confidential Agricultural Yield Optimization** - An innovative agricultural data analysis platform that enables multiple farms to share planting data for encrypted computation, obtaining optimal planting recommendations without exposing their respective commercial secrets.

This breakthrough platform allows agricultural cooperatives to collaborate on data-driven decision making while maintaining complete privacy of their proprietary farming data through advanced Fully Homomorphic Encryption (FHE) technology.

## 🎥 Demo

**Live Application**: [https://tyreebartoletti.github.io/FHECropYieldOptimizer/](https://tyreebartoletti.github.io/FHECropYieldOptimizer/)

**Video Demonstration**: demo1.mp4 demo2.mp4 demo3.mp4 

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

This repository includes two comprehensive examples demonstrating different integration approaches:

### 1. Next.js Template (Framework Integration) ✅

Complete Next.js 14 application with full SDK integration using @fhevm/sdk React hooks:

- **Location**: [`examples/nextjs-demo/`](./examples/nextjs-demo/)
- **Integration Type**: Full SDK with @fhevm/sdk React Hooks
- **SDK Usage**: Direct integration of `FHEProviderComponent`, `useEncryptUint32()`, `useEncryptBool()`, etc.
- **Features**:
  - ✅ Uses `@fhevm/sdk/react` FHEProviderComponent
  - ✅ SDK hooks: `useEncryptBool()`, `useEncryptUint8/16/32()`
  - ✅ Direct SDK integration without custom wrappers
  - ✅ Decryption with `useDecrypt()` hook from SDK
  - ✅ App Router with Server & Client Components
  - ✅ Homomorphic computation demonstrations
  - ✅ Real-world examples (Banking, Medical)
  - ✅ Key management interface
  - ✅ MetaMask wallet integration
  - ✅ TypeScript type safety
  - ✅ Loading states & error handling
  - ✅ Professional responsive UI

**Project Structure:**
```
nextjs-demo/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with FHE setup
│   │   ├── page.tsx              # Main demo page
│   │   ├── globals.css           # Global styles
│   │   └── api/                  # API routes for FHE operations
│   ├── components/
│   │   ├── fhe/                  # FHE-specific components
│   │   │   ├── FHEProvider.tsx   # FHE Context Provider
│   │   │   ├── EncryptionDemo.tsx
│   │   │   ├── ComputationDemo.tsx
│   │   │   └── KeyManager.tsx
│   │   ├── examples/             # Real-world use cases
│   │   │   ├── BankingExample.tsx
│   │   │   └── MedicalExample.tsx
│   │   └── ui/                   # Reusable UI components
│   ├── lib/
│   │   ├── fhe/                  # FHE integration library
│   │   │   ├── client.ts         # Client-side FHE operations
│   │   │   ├── server.ts         # Server-side FHE operations
│   │   │   ├── keys.ts           # Key management utilities
│   │   │   └── types.ts          # FHE type definitions
│   │   └── utils/                # Utility functions
│   │       ├── validation.ts
│   │       └── security.ts
│   ├── hooks/                    # Custom React hooks
│   │   ├── useFHE.ts             # Main FHE hook
│   │   ├── useEncryption.ts      # Encryption hook
│   │   └── useComputation.ts     # Computation hook
│   └── types/                    # TypeScript definitions
```

**Quick Start:**
```bash
# From monorepo root
npm run dev:nextjs
# Or from examples/nextjs-demo
cd examples/nextjs-demo && npm run dev
# Opens at http://localhost:3000
```

**SDK Integration Highlights:**
```tsx
// Wrap app with SDK provider
import { FHEProviderComponent } from '@fhevm/sdk/react';

<FHEProviderComponent
  config={{
    chainId: 11155111,
    gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
  }}
  autoInitialize
>
  <YourApp />
</FHEProviderComponent>

// Use SDK hooks directly in components
import { useEncryptUint32 } from '@fhevm/sdk/react';

const { encrypt, isEncrypting } = useEncryptUint32();
const encrypted = await encrypt(42);

// Component example
function EncryptionDemo() {
  const boolEncrypt = useEncryptBool();
  const uint32Encrypt = useEncryptUint32();

  const result = await uint32Encrypt.encrypt(42);
  // result.data contains encrypted ciphertext
}
```

**Demo Features:**
- 🔒 **Encryption Demo**: Interactive encryption of different data types
- 🔢 **Computation Demo**: Homomorphic operations (add, subtract, multiply, compare)
- 🏦 **Banking Example**: Private financial transactions
- ⚕️ **Medical Example**: Secure patient data management
- 🔑 **Key Manager**: FHE key information and management

[**📖 Next.js Template Full Documentation →**](./examples/nextjs-demo/README.md)

---

### 2. Vanilla HTML/JS Demo (Live Production App) 🌐

Real-world agricultural data collaboration platform:

- **Location**: [`examples/fheCropYieldOptimizer/`](./examples/fheCropYieldOptimizer/)
- **Live Demo**: [https://tyreebartoletti.github.io/FHECropYieldOptimizer/](https://tyreebartoletti.github.io/FHECropYieldOptimizer/)
- **Integration Type**: Vanilla JS with optional SDK integration guide
- **Use Case**: Privacy-preserving multi-farm yield optimization
- **Contract**: `0xf2301736A15a5152401E968cB8d995c0F508f568` on Sepolia

**Key Features:**
- 🏭 Farm registration system
- 📊 Encrypted agricultural data submission
- 🤝 Multi-party collaborative analysis
- 💡 Personalized optimization recommendations
- 🔒 Complete data privacy with FHE
- 📱 Responsive design for mobile & desktop

**Start Locally:**
```bash
cd examples/fheCropYieldOptimizer
npm install
npm start
# Opens at http://localhost:3000
```

**SDK Integration:**
A comprehensive SDK integration guide is provided:
- 📘 [**SDK Integration Guide**](./examples/fheCropYieldOptimizer/SDK_INTEGRATION_GUIDE.md) - Complete step-by-step instructions
- ✅ Package.json includes `@fhevm/sdk` dependency
- 💡 Example code for encryption and decryption
- 🔧 Smart contract compatibility guide

**Quick SDK Integration Example:**
```javascript
import { createProvider } from '@fhevm/sdk';

// Initialize SDK
const fheProvider = createProvider();
await fheProvider.initialize({
  chainId: 11155111,
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
});

// Encrypt agricultural data
const encryptedSoil = await fheProvider.encryptUint32(soilQuality);
const encryptedWater = await fheProvider.encryptUint32(waterUsage);
const encryptedYield = await fheProvider.encryptUint32(yieldAmount);

// Submit encrypted data to contract
await contract.submitFarmData(
  encryptedSoil.data,
  encryptedWater.data,
  encryptedYield.data
);

// Decrypt recommendations with EIP-712 signature
const result = await fheProvider.userDecrypt({
  handle: recommendationHandle,
  contractAddress: CONTRACT_ADDRESS,
  signer: signer
});
```

[**📖 FHE Crop Optimizer Documentation →**](./examples/fheCropYieldOptimizer/README.md) | [**🔧 SDK Integration Guide →**](./examples/fheCropYieldOptimizer/SDK_INTEGRATION_GUIDE.md)

---

### Comparison Table

| Feature | Next.js Demo | Crop Yield Optimizer |
|---------|-------------|---------------------|
| **Framework** | Next.js 14 | Vanilla HTML/JS |
| **SDK Integration** | ✅ Full (Direct SDK hooks) | ✅ Guide + Package ready |
| **SDK Usage** | `@fhevm/sdk/react` hooks | Vanilla `@fhevm/sdk` |
| **TypeScript** | ✅ Full | ❌ JavaScript |
| **Live Deployment** | Development | ✅ [Production](https://tyreebartoletti.github.io/FHECropYieldOptimizer/) |
| **Integration Docs** | In code | [SDK_INTEGRATION_GUIDE.md](./examples/fheCropYieldOptimizer/SDK_INTEGRATION_GUIDE.md) |
| **Use Case** | SDK Feature Demo | Real-world Application |
| **Complexity** | Moderate | Simple |
| **Best For** | React developers | Vanilla JS developers |
| **Smart Contract** | Demo contract | Production contract |

### Which Example Should I Use?

- **Choose Next.js Demo** if you're building a React/Next.js app and want to use SDK hooks
- **Choose Crop Yield Optimizer** if you need a vanilla JS example or real-world use case inspiration
- **Use Both** to see different integration patterns and choose what fits your stack

---

## 🏗️ Monorepo Structure

This project uses npm workspaces for efficient development:

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── provider.ts     # Core FHE provider
│       │   ├── encryption.ts   # Encryption utilities
│       │   ├── decryption.ts   # Decryption utilities
│       │   ├── utils.ts        # Helper functions
│       │   ├── types.ts        # TypeScript definitions
│       │   ├── index.ts        # Main exports
│       │   └── react/          # React hooks & providers
│       │       ├── context.tsx # FHE Context
│       │       ├── hooks.ts    # React hooks
│       │       └── index.ts    # React exports
│       ├── package.json
│       └── README.md           # SDK documentation
│
├── examples/
│   ├── nextjs-demo/            # Next.js 14 template with full SDK
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   │   ├── layout.tsx  # Root layout
│   │   │   │   ├── page.tsx    # Main page
│   │   │   │   ├── globals.css # Styles
│   │   │   │   └── api/        # API routes
│   │   │   ├── components/     # React components
│   │   │   │   ├── fhe/        # FHE components
│   │   │   │   ├── examples/   # Use case examples
│   │   │   │   └── ui/         # UI components
│   │   │   ├── lib/            # Libraries
│   │   │   │   ├── fhe/        # FHE integration
│   │   │   │   └── utils/      # Utilities
│   │   │   ├── hooks/          # Custom hooks
│   │   │   └── types/          # Type definitions
│   │   ├── package.json
│   │   └── README.md           # Next.js guide
│   │
│   └── fheCropYieldOptimizer/  # Vanilla JS production example
│       ├── contracts/
│       │   └── CropYieldOptimizer.sol
│       ├── index.html          # Main application
│       ├── deploy.js           # Contract deployment
│       ├── hardhat.config.js   # Hardhat configuration
│       ├── package.json
│       └── README.md           # App documentation
│
├── contracts/                  # Additional smart contracts
│   └── ConfidentialYieldOptimizer.sol
│
├── scripts/                    # Deployment scripts
│   └── deploy.js
│
├── docs/                       # Documentation
│   ├── README.md              # Documentation index
│   ├── QUICK_START.md         # Quick start guide
│   └── API.md                 # API reference
│
├── package.json                # Root workspace config
├── README.md                   # This file (main documentation)
├── ARCHITECTURE.md             # Architecture documentation
├── demo1.mp4                   # Video demonstrations
├── demo2.mp4
└── demo3.mp4
```

### Directory Guide

- **`packages/fhevm-sdk/`** - Universal TypeScript SDK (core package)
- **`examples/nextjs-demo/`** - Next.js integration with React hooks
- **`examples/fheCropYieldOptimizer/`** - Vanilla JS production application
- **`contracts/`** - Solidity smart contracts
- **`scripts/`** - Build and deployment utilities
- **`docs/`** - Complete documentation (Quick Start, API Reference)

---

## 🛠️ Development

### Install All Dependencies

```bash
# Install all packages including SDK and examples
npm install
```

### Build SDK

```bash
npm run build:sdk
```

This compiles both core and React packages.

### Run Examples

#### Next.js Demo
```bash
# From root
npm run dev:nextjs

# Or from examples directory
cd examples/nextjs-demo
npm install
npm run dev
```
Opens at http://localhost:3000

#### FHE Crop Yield Optimizer
```bash
# Navigate to example directory
cd examples/fheCropYieldOptimizer
npm install
npm start
```
Opens at http://localhost:3000

### Compile Contracts

```bash
npm run build:contracts

# Or compile specific example contracts
cd examples/fheCropYieldOptimizer
npx hardhat compile
```

### Deploy Contracts

```bash
# Deploy main contracts
npm run deploy

# Or deploy example contracts
cd examples/fheCropYieldOptimizer
npx hardhat run deploy.js --network sepolia
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
| Video Demo | ✅ | `demo1.mp4 demo2.mp4 demo3.mp4` |

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

- **Demo Application**: [https://tyreebartoletti.github.io/FHECropYieldOptimizer/](https://tyreebartoletti.github.io/FHECropYieldOptimizer/)
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

- **File**: `demo1.mp4 demo2.mp4 demo3.mp4`
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
git clone <your-repository-url>
cd fhevm-react-template

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
- [Quick Start Guide](./docs/QUICK_START.md) - Get started in 5 minutes
- [API Reference](./docs/API.md) - Complete API documentation
- [SDK Documentation](./packages/fhevm-sdk/README.md) - Core SDK details
- [Next.js Template Guide](./examples/nextjs-demo/README.md) - React integration guide
- [Architecture Overview](./ARCHITECTURE.md) - System design and architecture


### Links
- **Live Demo**: [https://tyreebartoletti.github.io/FHECropYieldOptimizer/](https://tyreebartoletti.github.io/FHECropYieldOptimizer/)
- **Zama Docs**: [https://docs.zama.ai/](https://docs.zama.ai/)
- **fhEVM Docs**: [https://docs.fhevm.zama.ai/](https://docs.fhevm.zama.ai/)
- **EIP-712 Specification**: [https://eips.ethereum.org/EIPS/eip-712](https://eips.ethereum.org/EIPS/eip-712)

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
