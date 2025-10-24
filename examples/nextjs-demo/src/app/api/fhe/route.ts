/**
 * Main FHE API Route
 * GET /api/fhe
 * Provides information about available FHE operations
 */

import { NextResponse } from 'next/server';
import type { APIResponse } from '@/types/api';

export async function GET() {
  return NextResponse.json<APIResponse>({
    success: true,
    message: 'FHE API is running',
    data: {
      version: '1.0.0',
      endpoints: {
        encrypt: {
          path: '/api/fhe/encrypt',
          method: 'POST',
          description: 'Encrypt values using FHE',
        },
        decrypt: {
          path: '/api/fhe/decrypt',
          method: 'POST',
          description: 'Decrypt FHE ciphertexts',
        },
        compute: {
          path: '/api/fhe/compute',
          method: 'POST',
          description: 'Perform homomorphic computations',
        },
        keys: {
          path: '/api/keys',
          method: 'POST',
          description: 'Generate and manage encryption keys',
        },
      },
      supportedTypes: ['bool', 'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256', 'address'],
      supportedOperations: ['add', 'subtract', 'multiply', 'compare', 'and', 'or', 'xor'],
    },
  });
}
