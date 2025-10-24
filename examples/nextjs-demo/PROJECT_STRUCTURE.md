# Next.js FHE Demo - Project Structure

This document describes the comprehensive Next.js example structure based on best practices for FHE integration.

## 📁 Directory Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with FHE provider
│   ├── page.tsx                # Homepage with demos
│   ├── globals.css             # Global styles
│   └── api/                    # API routes
│       ├── fhe/
│       │   ├── route.ts         # FHE info endpoint
│       │   ├── encrypt/route.ts # Encryption API
│       │   ├── decrypt/route.ts # Decryption API
│       │   └── compute/route.ts # Homomorphic computation API
│       └── keys/route.ts       # Key management API
│
├── components/                 # React components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx          # Reusable button
│   │   ├── Input.tsx           # Form input
│   │   └── Card.tsx            # Container card
│   ├── fhe/                    # FHE-specific components
│   │   ├── FHEProvider.tsx     # FHE context provider
│   │   ├── EncryptionDemo.tsx  # Encryption demo
│   │   ├── ComputationDemo.tsx # Computation demo (TODO)
│   │   └── KeyManager.tsx      # Key management (TODO)
│   └── examples/               # Use case examples
│       ├── BankingExample.tsx  # Banking/finance use case
│       └── MedicalExample.tsx  # Healthcare use case (TODO)
│
├── lib/                        # Utility libraries
│   ├── fhe/                    # FHE integration
│   │   ├── client.ts           # Client-side FHE operations
│   │   ├── server.ts           # Server-side helpers (TODO)
│   │   ├── keys.ts             # Key management (TODO)
│   │   └── types.ts            # FHE type definitions (TODO)
│   └── utils/                  # Utility functions
│       ├── security.ts         # Security utilities (TODO)
│       └── validation.ts       # Input validation
│
├── hooks/                      # Custom React hooks
│   ├── useFHE.ts               # Main FHE hook
│   ├── useEncryption.ts        # Encryption operations
│   └── useComputation.ts       # Computation operations (TODO)
│
├── types/                      # TypeScript definitions
│   ├── fhe.ts                  # FHE-related types
│   └── api.ts                  # API types
│
└── styles/                     # Style files
    └── globals.css             # Global CSS (in app/)
```

## 🎯 Component Overview

### API Routes

#### `/api/fhe` - FHE Information
- **Method**: GET
- **Purpose**: Provides information about available FHE operations
- **Returns**: Endpoint list, supported types and operations

#### `/api/fhe/encrypt` - Encryption API
- **Method**: POST
- **Purpose**: Encrypt values using FHE (demonstration - should be client-side)
- **Input**: `{ value, type }`
- **Returns**: Encrypted ciphertext

#### `/api/fhe/decrypt` - Decryption API
- **Method**: POST
- **Purpose**: Decrypt FHE ciphertexts (requires EIP-712 signature)
- **Input**: `{ handle, contractAddress, signature }`
- **Returns**: Decrypted value

#### `/api/fhe/compute` - Homomorphic Computation
- **Method**: POST
- **Purpose**: Perform computations on encrypted data
- **Input**: `{ operation, operand1, operand2, type }`
- **Returns**: Computation result (encrypted)

#### `/api/keys` - Key Management
- **Method**: POST/GET
- **Purpose**: Generate and manage encryption keys
- **Input**: `{ userId, keyType }`
- **Returns**: Public key and key ID

### React Components

#### UI Components
- **Button**: Reusable button with variants (primary, secondary, outline, danger)
- **Input**: Form input with label, error display, and helper text
- **Card**: Container card with optional title and description

#### FHE Components
- **FHEProvider**: Context provider for FHE operations with auto-initialization
- **EncryptionDemo**: Interactive demo for encrypting different data types
- **ComputationDemo**: Demo for homomorphic computations (TODO)
- **KeyManager**: Interface for managing encryption keys (TODO)

#### Example Components
- **BankingExample**: Private banking transactions with encrypted amounts
- **MedicalExample**: Healthcare data privacy demo (TODO)

### Custom Hooks

#### useFHE
Main hook providing:
- FHE initialization
- Encryption operations
- Decryption with EIP-712
- Error handling and loading states

#### useEncryption
Specialized hook for encryption:
- Encrypt values by type
- Manage encrypted data state
- Handle encryption errors
- Reset functionality

#### useComputation (TODO)
Hook for homomorphic computations:
- Add, subtract, multiply encrypted values
- Compare encrypted values
- Logical operations (AND, OR, XOR)

## 🔧 Library Functions

### FHE Client (`lib/fhe/client.ts`)

**initializeFHE(config: FHEConfig)**
- Initializes the FHE provider with chain configuration
- Should be called once at app startup

**encryptValue(value: any, type: FHEType)**
- Encrypts a value using the specified FHE type
- Supports: bool, uint8, uint16, uint32, uint64, uint128, uint256, address

**decryptValue(handle, contractAddress, signer)**
- Decrypts a ciphertext using EIP-712 signature
- Requires user's wallet signer

**getFHEProvider()**
- Returns the initialized FHE provider instance

**isFHEInitialized()**
- Checks if FHE provider is ready

### Validation Utilities (`lib/utils/validation.ts`)

**validateValueRange(value, type)**
- Validates if a value is within valid range for FHE type

**validateAddress(address)**
- Validates Ethereum address format

**validateEncryptedData(data)**
- Validates encrypted data format

**validateHandle(handle)**
- Validates FHE handle format

## 🎨 Usage Examples

### Basic Encryption

```typescript
import { useEncryption } from '@/hooks/useEncryption';

function MyComponent() {
  const { encrypt, encryptedData, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const result = await encrypt(42, 'uint32');
    console.log('Encrypted:', result?.data);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt
    </button>
  );
}
```

### Using FHE Provider

```typescript
// app/layout.tsx
import { FHEProvider } from '@/components/fhe/FHEProvider';

const fheConfig = {
  chainId: 11155111,
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10',
};

export default function RootLayout({ children }) {
  return (
    <FHEProvider config={fheConfig} autoInitialize>
      {children}
    </FHEProvider>
  );
}
```

### API Integration

```typescript
// Call encryption API
const response = await fetch('/api/fhe/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ value: 42, type: 'uint32' }),
});

const { data } = await response.json();
console.log('Encrypted:', data.encrypted);
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 📝 TODO

- [ ] Implement ComputationDemo component
- [ ] Create KeyManager component
- [ ] Add MedicalExample use case
- [ ] Implement server-side FHE helpers
- [ ] Add comprehensive tests
- [ ] Create more example use cases (voting, auction, etc.)
- [ ] Add WebSocket support for real-time updates
- [ ] Implement caching for encrypted data

## 🔐 Security Considerations

1. **Client-Side Encryption**: Always encrypt sensitive data on the client
2. **EIP-712 Signatures**: Required for all decryption operations
3. **Input Validation**: Validate all inputs before encryption
4. **Error Handling**: Never expose sensitive information in errors
5. **Key Management**: Implement secure key storage and rotation

## 📚 Resources

- [fhEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama fhEVM Docs](https://docs.zama.ai/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Built with Next.js 14 and @fhevm/sdk
