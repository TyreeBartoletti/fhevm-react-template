# Next.js fhEVM SDK Demo

> Comprehensive Next.js 14 application demonstrating @fhevm/sdk integration with production-ready architecture

This example showcases a complete, production-ready implementation of FHE in Next.js featuring:
- ✅ Next.js 14 with App Router
- ✅ React Server Components and Client Components
- ✅ Full TypeScript implementation
- ✅ Custom FHE hooks and providers
- ✅ RESTful API routes for FHE operations
- ✅ Reusable UI components
- ✅ Real-world use case examples
- ✅ Comprehensive error handling
- ✅ MetaMask wallet integration

## Features Demonstrated

### 🏗️ Architecture
- **Modular structure**: Organized by feature (components, lib, hooks, types, api)
- **Custom FHE Provider**: Context-based state management with auto-initialization
- **TypeScript throughout**: Full type safety and IntelliSense support
- **API Routes**: RESTful endpoints for FHE operations

### 🔐 FHE Operations
- **Encryption**: All FHE types (bool, uint8/16/32/64/128/256, address)
- **Decryption**: EIP-712 signature-based with wallet integration
- **Validation**: Input validation for all encryption types
- **Error Handling**: Comprehensive error states and messages

### 🎨 UI Components
- **Button**: Variants (primary, secondary, outline, danger) with loading states
- **Input**: Form inputs with labels, errors, and helper text
- **Card**: Container components with titles and descriptions

### 🧪 Custom Hooks
- **useFHE**: Main hook for FHE initialization and operations
- **useEncryption**: Specialized encryption operations with state management
- **useFHEContext**: Access FHE context from any component

### 📦 API Endpoints
- `POST /api/fhe/encrypt` - Encrypt values (demo endpoint)
- `POST /api/fhe/decrypt` - Decrypt ciphertexts with EIP-712
- `POST /api/fhe/compute` - Homomorphic computations
- `POST /api/keys` - Key generation and management
- `GET /api/fhe` - API information and capabilities

### 💼 Use Case Examples
- **Banking Demo**: Private financial transactions with encrypted amounts
- **Medical Example**: Healthcare data privacy (structure ready)
- More examples can be easily added following the pattern

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
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout with FHE provider
│   │   ├── page.tsx             # Homepage with demos
│   │   ├── globals.css          # Global styles
│   │   └── api/                 # API routes
│   │       ├── fhe/
│   │       │   ├── route.ts         # FHE info endpoint
│   │       │   ├── encrypt/route.ts # Encryption API
│   │       │   ├── decrypt/route.ts # Decryption API
│   │       │   └── compute/route.ts # Computation API
│   │       └── keys/route.ts    # Key management
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── fhe/                 # FHE components
│   │   │   ├── FHEProvider.tsx
│   │   │   └── EncryptionDemo.tsx
│   │   └── examples/            # Use cases
│   │       └── BankingExample.tsx
│   │
│   ├── lib/                     # Utilities
│   │   ├── fhe/
│   │   │   └── client.ts        # FHE client operations
│   │   └── utils/
│   │       └── validation.ts    # Input validation
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useFHE.ts
│   │   └── useEncryption.ts
│   │
│   └── types/                   # TypeScript types
│       ├── fhe.ts
│       └── api.ts
│
├── package.json
├── next.config.js
├── tsconfig.json
├── README.md                    # This file
└── PROJECT_STRUCTURE.md         # Detailed architecture docs
```

For detailed documentation on each component, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

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

## API Usage Examples

### Encrypt via API
```typescript
const response = await fetch('/api/fhe/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ value: 42, type: 'uint32' }),
});
const { data } = await response.json();
```

### Decrypt via API
```typescript
const response = await fetch('/api/fhe/decrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    handle: '0x...',
    contractAddress: '0x...',
    signature: '0x...',
  }),
});
const { data } = await response.json();
```

### Get API Info
```typescript
const response = await fetch('/api/fhe');
const info = await response.json();
console.log('Supported operations:', info.data.supportedOperations);
```

## Learning Resources

- [Project Structure Documentation](./PROJECT_STRUCTURE.md)
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
