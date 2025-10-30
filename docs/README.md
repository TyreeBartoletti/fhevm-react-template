# fhEVM SDK Documentation

Welcome to the fhEVM SDK documentation! This directory contains comprehensive guides and references for using the SDK.

## 📚 Documentation Index

### Getting Started
- **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes
  - Installation instructions
  - Basic usage examples
  - First FHE application

### Reference
- **[API Reference](./API.md)** - Complete API documentation
  - Core SDK methods
  - React hooks
  - TypeScript types
  - Configuration options

### Architecture
- **[Architecture Overview](../ARCHITECTURE.md)** - SDK design and structure
  - System architecture
  - Design decisions
  - Component interaction

## 🎯 Quick Links

### For Beginners
1. Start with [Quick Start Guide](./QUICK_START.md)
2. Try the [Next.js Example](../examples/nextjs-demo/)
3. Read [API Reference](./API.md) basics

### For React Developers
1. [Quick Start - React Section](./QUICK_START.md#react--nextjs)
2. [React Hooks API](./API.md#react-hooks-api)
3. [Next.js Template](../examples/nextjs-demo/)

### For Vanilla JS Developers
1. [Quick Start - Vanilla JS Section](./QUICK_START.md#vanilla-javascript)
2. [Core SDK API](./API.md#core-sdk-api)
3. [Crop Optimizer Example](../examples/fheCropYieldOptimizer/)

## 📖 Documentation Structure

```
docs/
├── README.md          # This file - Documentation index
├── QUICK_START.md     # Getting started guide
└── API.md             # Complete API reference
```

## 🔑 Key Concepts

### What is FHE?

**Fully Homomorphic Encryption (FHE)** allows computations on encrypted data without decryption. This means:

- 🔒 Data remains encrypted during processing
- 🤝 Multiple parties can collaborate on encrypted data
- 🔐 Privacy is preserved end-to-end
- ⚡ Smart contracts compute on ciphertext

### SDK Overview

The fhEVM SDK provides:

- **Framework-Agnostic Core** - Works with any JavaScript framework
- **React Integration** - Wagmi-like hooks for React applications
- **Type Safety** - Full TypeScript support
- **Easy Initialization** - One-line provider setup
- **All FHE Types** - bool, uint8-256, address support
- **EIP-712 Decryption** - Secure signature-based authorization

## 🚀 Quick Example

### Vanilla JavaScript
```javascript
import { createProvider } from '@fhevm/sdk';

const provider = createProvider();
await provider.initialize({
  chainId: 11155111,
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
});

const encrypted = await provider.encryptUint32(42);
await contract.submitValue(encrypted.data);
```

### React
```tsx
import { FHEProviderComponent, useEncryptUint32 } from '@fhevm/sdk/react';

function App() {
  return (
    <FHEProviderComponent config={{...}} autoInitialize>
      <YourApp />
    </FHEProviderComponent>
  );
}

function Component() {
  const { encrypt } = useEncryptUint32();
  const encrypted = await encrypt(42);
}
```

## 🎓 Learning Path

### Level 1: Basics
1. Understand [what FHE is](#what-is-fhe)
2. Follow [Quick Start Guide](./QUICK_START.md)
3. Run the [Next.js example](../examples/nextjs-demo/)

### Level 2: Integration
1. Learn [encryption methods](./API.md#encryption-methods)
2. Understand [decryption flow](./API.md#decryption-methods)
3. Study [error handling](./QUICK_START.md#error-handling)

### Level 3: Advanced
1. Read [Architecture](../ARCHITECTURE.md)
2. Explore [smart contract integration](./QUICK_START.md#smart-contracts)
3. Build your own FHE application

## 📋 Common Tasks

### How do I...

**Initialize the SDK?**
→ See [Quick Start - Step 2](./QUICK_START.md#step-2-initialize-provider)

**Encrypt a value?**
→ See [API - Encryption Methods](./API.md#encryption-methods)

**Use React hooks?**
→ See [Quick Start - React](./QUICK_START.md#react--nextjs)

**Decrypt with signature?**
→ See [API - userDecrypt](./API.md#userdecryptrequest-decryptrequest)

**Handle errors?**
→ See [Quick Start - Error Handling](./QUICK_START.md#error-handling)

**Deploy to production?**
→ See [Quick Start - Deploy](./QUICK_START.md#4-deploy-your-app)

## 🔧 Configuration

### Network Configurations

#### Sepolia Testnet (Recommended for Testing)
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
  gatewayAddress: '0x...' // Your local gateway
}
```

## 🎨 Examples

### Available Examples

1. **Next.js Template** - [`examples/nextjs-demo/`](../examples/nextjs-demo/)
   - Full Next.js 14 application
   - React hooks integration
   - Real-world use cases
   - Professional UI

2. **Crop Yield Optimizer** - [`examples/fheCropYieldOptimizer/`](../examples/fheCropYieldOptimizer/)
   - Vanilla JavaScript
   - Live deployment
   - Production smart contract
   - Agricultural use case

### Running Examples

```bash
# Next.js example
cd examples/nextjs-demo
npm install
npm run dev

# Crop Optimizer
cd examples/fheCropYieldOptimizer
npm install
npm start
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "FHE not initialized" | Call `initialize()` before use |
| "MetaMask not found" | Install MetaMask extension |
| "Invalid network" | Switch to correct network |
| "Encryption failed" | Check value range for type |

See [Quick Start - Troubleshooting](./QUICK_START.md#troubleshooting) for more.

## 📞 Support

### Getting Help

- **Documentation**: You're here! Browse the guides
- **Examples**: Check working code in `examples/`
- **Issues**: Open a GitHub issue
- **API Docs**: See [API.md](./API.md)

### Contributing

We welcome contributions!

- Report bugs via GitHub issues
- Suggest features
- Improve documentation
- Submit pull requests

## 🔗 External Resources

### Zama Resources
- [Zama Documentation](https://docs.zama.ai/)
- [fhEVM Documentation](https://docs.fhevm.zama.ai/)
- [Zama GitHub](https://github.com/zama-ai)

### Ethereum Resources
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 📄 License

This SDK is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

---

**Ready to start?** Head to the [Quick Start Guide](./QUICK_START.md)! 🚀
