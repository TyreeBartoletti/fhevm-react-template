# Next.js fhEVM SDK Demo

> Next.js 14 application demonstrating @fhevm/sdk integration with App Router

This example demonstrates how to integrate the fhEVM SDK into a Next.js application using:
- ✅ Next.js 14 with App Router
- ✅ React Server Components and Client Components
- ✅ TypeScript for type safety
- ✅ @fhevm/sdk React hooks
- ✅ MetaMask wallet integration
- ✅ Full FHE encryption/decryption workflow

## Features Demonstrated

### SDK Integration
- FHEProviderComponent wrapping the entire app
- Auto-initialization of FHE instance
- Context-based state management

### Encryption Examples
- Boolean encryption (ebool)
- Uint8 encryption (euint8)
- Uint16 encryption (euint16)
- Uint32 encryption (euint32)

### Decryption Examples
- EIP-712 signature-based decryption
- User-friendly wallet prompts
- Type-safe result handling

### Developer Experience
- Loading states for all operations
- Error handling with user feedback
- TypeScript autocomplete
- Wagmi-like familiar API

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MetaMask browser extension
- Sepolia testnet ETH (for gas fees)

### Installation

From the root of the monorepo:

```bash
# Install all dependencies including this example
npm install

# Or install only this example
cd examples/nextjs-demo
npm install
```

### Development

```bash
# From monorepo root
npm run dev:nextjs

# Or from this directory
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
nextjs-demo/
├── app/
│   ├── layout.tsx          # Root layout with FHEProviderComponent
│   ├── page.tsx            # Main demo page with SDK examples
│   └── globals.css         # Global styles
├── package.json            # Dependencies and scripts
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Key Implementation Details

### 1. Provider Setup (layout.tsx)

The FHE provider wraps the entire application:

```tsx
import { FHEProviderComponent } from '@fhevm/sdk/react';

const fheConfig = {
  chainId: 11155111, // Sepolia testnet
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FHEProviderComponent config={fheConfig} autoInitialize>
          {children}
        </FHEProviderComponent>
      </body>
    </html>
  );
}
```

### 2. Using Encryption Hooks (page.tsx)

Client components can use SDK hooks:

```tsx
'use client';

import { useEncryptUint32 } from '@fhevm/sdk/react';

export default function Page() {
  const { encrypt, isEncrypting, error } = useEncryptUint32();

  const handleEncrypt = async () => {
    const result = await encrypt(42);
    console.log('Encrypted:', result.data);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
    </button>
  );
}
```

### 3. Using Decryption with Wallet (page.tsx)

Decryption requires EIP-712 signature:

```tsx
import { useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

const { decrypt, result } = useDecrypt();

const handleDecrypt = async () => {
  const signer = provider.getSigner();

  await decrypt({
    handle: 'ciphertextHandle',
    contractAddress: '0xContractAddress',
    signer,
  });

  console.log('Decrypted value:', result.numberValue);
};
```

## Environment Configuration

### Sepolia Testnet
- **Chain ID**: 11155111
- **Gateway Address**: 0x33347831500F1e73f102414fAf8fD6b494F06a10
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY

### Adding to MetaMask
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter Sepolia details or use "Add Sepolia" button

## Troubleshooting

### "window is not defined" Error
Make sure components using browser APIs are marked with `'use client'`:

```tsx
'use client';

// Your component code
```

### FHE SDK Not Initializing
Check that:
- FHEProviderComponent is in your layout.tsx
- autoInitialize prop is set to true
- You're on a supported network (Sepolia)

### Wallet Connection Fails
Ensure:
- MetaMask is installed
- You're on the correct network
- Browser has permission to access MetaMask

### Build Errors with fhevmjs
Make sure next.config.js has the correct webpack configuration:

```js
webpack: (config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
  };
  return config;
}
```

## Learning Resources

- [fhEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama fhEVM Docs](https://docs.zama.ai/)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)

## Next Steps

### Extend This Example
1. Add more FHE operations (comparison, arithmetic)
2. Implement batch encryption
3. Create contract interaction examples
4. Add transaction status tracking
5. Implement error recovery flows

### Deploy to Production
1. Build: `npm run build`
2. Test production build: `npm start`
3. Deploy to Vercel: `vercel deploy`
4. Configure environment variables
5. Test on Sepolia testnet

## License

MIT License - see root LICENSE file for details

---

**Built with @fhevm/sdk for the Zama SDK Design Competition**

For questions or issues, see the [main repository](../../README.md).
