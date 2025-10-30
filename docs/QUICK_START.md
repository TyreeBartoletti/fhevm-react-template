# Quick Start Guide

Get started with fhEVM SDK in minutes!

## Table of Contents

- [Installation](#installation)
- [Vanilla JavaScript](#vanilla-javascript)
- [React / Next.js](#react--nextjs)
- [Basic Operations](#basic-operations)
- [Next Steps](#next-steps)

---

## Installation

### npm
```bash
npm install @fhevm/sdk ethers
```

### yarn
```bash
yarn add @fhevm/sdk ethers
```

### pnpm
```bash
pnpm add @fhevm/sdk ethers
```

---

## Vanilla JavaScript

Perfect for vanilla JS, HTML, or non-React frameworks.

### Step 1: Import SDK

```javascript
import { createProvider } from '@fhevm/sdk';
```

### Step 2: Initialize Provider

```javascript
const provider = createProvider();

await provider.initialize({
  chainId: 11155111, // Sepolia testnet
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
});
```

### Step 3: Encrypt Data

```javascript
// Encrypt different types
const boolEncrypted = await provider.encryptBool(true);
const uint32Encrypted = await provider.encryptUint32(42);
const addressEncrypted = await provider.encryptAddress('0x...');
```

### Step 4: Use in Contract Calls

```javascript
import { ethers } from 'ethers';

// Connect to wallet
const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = ethProvider.getSigner();

// Initialize contract
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);

// Submit encrypted data
const tx = await contract.submitValue(uint32Encrypted.data);
await tx.wait();
```

### Step 5: Decrypt Results

```javascript
// Get encrypted result from contract
const encryptedResult = await contract.getEncryptedValue();

// Decrypt with signature
const decrypted = await provider.userDecrypt({
  handle: encryptedResult,
  contractAddress: contract.address,
  signer: signer
});

console.log('Decrypted value:', decrypted.numberValue);
```

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>FHE Demo</title>
</head>
<body>
  <h1>FHE Encryption Demo</h1>

  <input type="number" id="valueInput" placeholder="Enter a number">
  <button onclick="encryptAndSubmit()">Encrypt & Submit</button>

  <script type="module">
    import { createProvider } from 'https://unpkg.com/@fhevm/sdk';
    import { ethers } from 'https://unpkg.com/ethers@5.7.2/dist/ethers.esm.js';

    let provider;
    let contract;

    async function init() {
      // Initialize FHE
      provider = createProvider();
      await provider.initialize({
        chainId: 11155111,
        gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
      });

      // Connect wallet
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      await ethProvider.send("eth_requestAccounts", []);
      const signer = ethProvider.getSigner();

      // Initialize contract
      contract = new ethers.Contract(contractAddress, abi, signer);
    }

    async function encryptAndSubmit() {
      const value = document.getElementById('valueInput').value;

      // Encrypt
      const encrypted = await provider.encryptUint32(Number(value));

      // Submit to contract
      const tx = await contract.submitValue(encrypted.data);
      await tx.wait();

      alert('Value submitted successfully!');
    }

    window.encryptAndSubmit = encryptAndSubmit;
    init();
  </script>
</body>
</html>
```

---

## React / Next.js

For React and Next.js applications with hooks support.

### Step 1: Wrap App with Provider

```tsx
// app/layout.tsx (Next.js 13+) or App.tsx (React)
import { FHEProviderComponent } from '@fhevm/sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FHEProviderComponent
          config={{
            chainId: 11155111,
            gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
          }}
          autoInitialize
        >
          {children}
        </FHEProviderComponent>
      </body>
    </html>
  );
}
```

### Step 2: Use Hooks in Components

```tsx
'use client'; // Next.js 13+ client component

import { useEncryptUint32, useDecrypt } from '@fhevm/sdk/react';
import { useState } from 'react';

export function EncryptionDemo() {
  const [value, setValue] = useState('');
  const { encrypt, isEncrypting, result } = useEncryptUint32();
  const { decrypt, isDecrypting, result: decrypted } = useDecrypt();

  const handleEncrypt = async () => {
    await encrypt(Number(value));
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
      />

      <button onClick={handleEncrypt} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>

      {result && (
        <div>
          <p>Encrypted: {result.data.substring(0, 20)}...</p>
        </div>
      )}
    </div>
  );
}
```

### Step 3: Contract Integration

```tsx
import { useEncryptUint32 } from '@fhevm/sdk/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export function ContractDemo() {
  const [contract, setContract] = useState(null);
  const { encrypt } = useEncryptUint32();

  useEffect(() => {
    async function setupContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setContract(contractInstance);
    }

    setupContract();
  }, []);

  const submitValue = async (value) => {
    // Encrypt with FHE
    const encrypted = await encrypt(value);

    // Submit to blockchain
    const tx = await contract.submitValue(encrypted.data);
    await tx.wait();

    alert('Success!');
  };

  return (
    <button onClick={() => submitValue(42)}>
      Submit Encrypted Value
    </button>
  );
}
```

---

## Basic Operations

### Encryption Types

```typescript
// Boolean
const bool = await provider.encryptBool(true);

// Unsigned integers
const uint8 = await provider.encryptUint8(255);
const uint16 = await provider.encryptUint16(65535);
const uint32 = await provider.encryptUint32(4294967295);
const uint64 = await provider.encryptUint64(BigInt("18446744073709551615"));
const uint128 = await provider.encryptUint128(BigInt("340282366920938463463374607431768211455"));
const uint256 = await provider.encryptUint256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));

// Ethereum address
const address = await provider.encryptAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
```

### Decryption

```typescript
// With signature (private data)
const result = await provider.userDecrypt({
  handle: ciphertextHandle,
  contractAddress: '0x...',
  signer: ethersSigner
});

// Without signature (public data)
const publicResult = await provider.publicDecrypt({
  handle: publicHandle,
  contractAddress: '0x...'
});

// Access decrypted values
console.log(result.value);        // String
console.log(result.numberValue);  // Number (if numeric)
console.log(result.boolValue);    // Boolean (if bool)
```

### Error Handling

```typescript
try {
  const encrypted = await provider.encryptUint32(42);
  await contract.submitValue(encrypted.data);
} catch (error) {
  if (error.code === 'USER_REJECTED') {
    console.log('User rejected transaction');
  } else {
    console.error('Operation failed:', error);
  }
}
```

---

## Next Steps

### 1. Explore Examples

Check out complete working examples:

- **Next.js Template**: `examples/nextjs-demo/`
  - Full-featured React application
  - All hooks demonstrated
  - Real-world use cases

- **Crop Yield Optimizer**: `examples/fheCropYieldOptimizer/`
  - Production vanilla JS app
  - Live deployment
  - Complex FHE operations

### 2. Read Documentation

- [API Reference](./API.md) - Complete API documentation
- [Architecture](../ARCHITECTURE.md) - SDK design and structure
- [Main README](../README.md) - Project overview

### 3. Smart Contracts

Learn how to write FHE-compatible smart contracts:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/contracts/FHE.sol";

contract ConfidentialStorage {
    euint32 private storedValue;

    function setValue(einput encryptedValue, bytes calldata inputProof) public {
        storedValue = FHE.asEuint32(encryptedValue, inputProof);
    }

    function getValue() public view returns (euint32) {
        return storedValue;
    }

    // Add homomorphic operations
    function addValue(einput encryptedValue, bytes calldata inputProof) public {
        euint32 newValue = FHE.asEuint32(encryptedValue, inputProof);
        storedValue = FHE.add(storedValue, newValue);
    }
}
```

### 4. Deploy Your App

Deploy to production:

```bash
# Build SDK
npm run build:sdk

# Build your app
npm run build

# Deploy (example with Vercel)
vercel deploy

# Or deploy contracts
npm run deploy
```

### 5. Join Community

- Star the repository
- Report issues
- Contribute improvements
- Share your projects

---

## Troubleshooting

### Common Issues

**"FHE not initialized"**
- Make sure to call `initialize()` before encryption
- In React, ensure `<FHEProviderComponent>` wraps your app

**"MetaMask not found"**
- Install MetaMask extension
- Check `window.ethereum` is available

**"Invalid network"**
- Switch to correct network (Sepolia testnet)
- Verify chainId in configuration

**"Encryption failed"**
- Check value is within valid range for type
- Ensure FHE provider is initialized
- Verify network connectivity

### Getting Help

- Check [API Documentation](./API.md)
- Review [Examples](../examples/)
- Open GitHub issue
- Read error messages carefully

---

## Summary

You now know how to:

✅ Install and initialize fhEVM SDK
✅ Encrypt data client-side
✅ Submit encrypted data to contracts
✅ Decrypt results with signatures
✅ Use React hooks for FHE operations
✅ Handle errors properly

**Ready to build privacy-preserving dApps!** 🚀

For more advanced usage, check out the [API Documentation](./API.md) and [Examples](../examples/).
