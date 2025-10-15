'use client';

import { FHEProviderComponent } from '@fhevm/sdk/react';
import './globals.css';

const fheConfig = {
  chainId: 11155111, // Sepolia testnet
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10', // Gateway v2.0
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>fhEVM SDK Next.js Demo</title>
        <meta name="description" content="Next.js application using @fhevm/sdk for Fully Homomorphic Encryption" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <FHEProviderComponent config={fheConfig} autoInitialize>
          {children}
        </FHEProviderComponent>
      </body>
    </html>
  );
}
