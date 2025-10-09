'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  useFHEInitialized,
  useEncryptBool,
  useEncryptUint8,
  useEncryptUint16,
  useEncryptUint32,
  useDecrypt,
  useFHEContract,
} from '@fhevm/sdk/react';

// Example contract ABI (simplified)
const CONTRACT_ABI = [
  'function submitEncryptedValue(bytes calldata encryptedValue) external',
  'function getEncryptedResult() external view returns (uint256)',
];

const CONTRACT_ADDRESS = '0xf2301736A15a5152401E968cB8d995c0F508f568'; // Example contract on Sepolia

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const isFHEReady = useFHEInitialized();
  const { encrypt: encryptBool, isEncrypting: isEncryptingBool, error: boolError } = useEncryptBool();
  const { encrypt: encryptUint8, isEncrypting: isEncryptingUint8, error: uint8Error } = useEncryptUint8();
  const { encrypt: encryptUint16, isEncrypting: isEncryptingUint16, error: uint16Error } = useEncryptUint16();
  const { encrypt: encryptUint32, isEncrypting: isEncryptingUint32, error: uint32Error } = useEncryptUint32();
  const { decrypt, isDecrypting, error: decryptError, result: decryptResult } = useDecrypt();

  const [boolValue, setBoolValue] = useState(true);
  const [uint8Value, setUint8Value] = useState(42);
  const [uint16Value, setUint16Value] = useState(1000);
  const [uint32Value, setUint32Value] = useState(1000000);

  const [encryptedBool, setEncryptedBool] = useState<string>('');
  const [encryptedUint8, setEncryptedUint8] = useState<string>('');
  const [encryptedUint16, setEncryptedUint16] = useState<string>('');
  const [encryptedUint32, setEncryptedUint32] = useState<string>('');

  const [handleToDecrypt, setHandleToDecrypt] = useState<string>('');

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();

        setProvider(web3Provider);
        setSigner(signer);
        setWalletAddress(address);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please make sure MetaMask is installed.');
      }
    } else {
      alert('Please install MetaMask to use this application.');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress('');
    setSigner(null);
    setProvider(null);
  };

  // Encryption handlers
  const handleEncryptBool = async () => {
    const result = await encryptBool(boolValue);
    if (result) {
      setEncryptedBool(result.data);
    }
  };

  const handleEncryptUint8 = async () => {
    const result = await encryptUint8(uint8Value);
    if (result) {
      setEncryptedUint8(result.data);
    }
  };

  const handleEncryptUint16 = async () => {
    const result = await encryptUint16(uint16Value);
    if (result) {
      setEncryptedUint16(result.data);
    }
  };

  const handleEncryptUint32 = async () => {
    const result = await encryptUint32(uint32Value);
    if (result) {
      setEncryptedUint32(result.data);
    }
  };

  // Decryption handler
  const handleDecrypt = async () => {
    if (!signer) {
      alert('Please connect your wallet first');
      return;
    }

    if (!handleToDecrypt) {
      alert('Please enter a ciphertext handle');
      return;
    }

    await decrypt({
      handle: handleToDecrypt,
      contractAddress: CONTRACT_ADDRESS,
      signer,
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🔐 fhEVM SDK Next.js Demo</h1>
        <p>Fully Homomorphic Encryption for Ethereum - Next.js Integration</p>

        {/* Wallet Connection Button */}
        <div style={{ marginTop: '2rem' }}>
          {!walletAddress ? (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect MetaMask Wallet
            </button>
          ) : (
            <div>
              <span className="status-badge connected">
                Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                className="btn btn-secondary"
                onClick={disconnectWallet}
                style={{ marginLeft: '1rem' }}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* FHE Status */}
        <div style={{ marginTop: '1rem' }}>
          {isFHEReady ? (
            <span className="status-badge connected">FHE SDK Ready ✓</span>
          ) : (
            <span className="status-badge disconnected">FHE SDK Initializing...</span>
          )}
        </div>
      </div>

      {/* Encryption Section */}
      <div className="card">
        <h2>🔒 Encryption Examples</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Encrypt various data types using FHE. All encryption happens locally in your browser.
        </p>

        <div className="grid">
          {/* Boolean Encryption */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Encrypt Boolean</h3>
            <div className="form-group">
              <label>Value:</label>
              <select
                value={boolValue.toString()}
                onChange={(e) => setBoolValue(e.target.value === 'true')}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleEncryptBool}
              disabled={!isFHEReady || isEncryptingBool}
            >
              {isEncryptingBool ? <span className="loading" /> : 'Encrypt Boolean'}
            </button>
            {encryptedBool && (
              <div className="result-box success">
                <h3>Encrypted Result:</h3>
                <p><code>{encryptedBool.slice(0, 50)}...</code></p>
              </div>
            )}
            {boolError && (
              <div className="result-box error">
                <p>{boolError.message}</p>
              </div>
            )}
          </div>

          {/* Uint8 Encryption */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Encrypt Uint8</h3>
            <div className="form-group">
              <label>Value (0-255):</label>
              <input
                type="number"
                value={uint8Value}
                onChange={(e) => setUint8Value(Number(e.target.value))}
                min="0"
                max="255"
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleEncryptUint8}
              disabled={!isFHEReady || isEncryptingUint8}
            >
              {isEncryptingUint8 ? <span className="loading" /> : 'Encrypt Uint8'}
            </button>
            {encryptedUint8 && (
              <div className="result-box success">
                <h3>Encrypted Result:</h3>
                <p><code>{encryptedUint8.slice(0, 50)}...</code></p>
              </div>
            )}
            {uint8Error && (
              <div className="result-box error">
                <p>{uint8Error.message}</p>
              </div>
            )}
          </div>

          {/* Uint16 Encryption */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Encrypt Uint16</h3>
            <div className="form-group">
              <label>Value (0-65535):</label>
              <input
                type="number"
                value={uint16Value}
                onChange={(e) => setUint16Value(Number(e.target.value))}
                min="0"
                max="65535"
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleEncryptUint16}
              disabled={!isFHEReady || isEncryptingUint16}
            >
              {isEncryptingUint16 ? <span className="loading" /> : 'Encrypt Uint16'}
            </button>
            {encryptedUint16 && (
              <div className="result-box success">
                <h3>Encrypted Result:</h3>
                <p><code>{encryptedUint16.slice(0, 50)}...</code></p>
              </div>
            )}
            {uint16Error && (
              <div className="result-box error">
                <p>{uint16Error.message}</p>
              </div>
            )}
          </div>

          {/* Uint32 Encryption */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Encrypt Uint32</h3>
            <div className="form-group">
              <label>Value (0-4294967295):</label>
              <input
                type="number"
                value={uint32Value}
                onChange={(e) => setUint32Value(Number(e.target.value))}
                min="0"
                max="4294967295"
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleEncryptUint32}
              disabled={!isFHEReady || isEncryptingUint32}
            >
              {isEncryptingUint32 ? <span className="loading" /> : 'Encrypt Uint32'}
            </button>
            {encryptedUint32 && (
              <div className="result-box success">
                <h3>Encrypted Result:</h3>
                <p><code>{encryptedUint32.slice(0, 50)}...</code></p>
              </div>
            )}
            {uint32Error && (
              <div className="result-box error">
                <p>{uint32Error.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decryption Section */}
      <div className="card">
        <h2>🔓 Decryption Example</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Decrypt FHE values using EIP-712 signatures. Requires wallet connection.
        </p>

        <div className="form-group">
          <label>Ciphertext Handle:</label>
          <input
            type="text"
            placeholder="0x..."
            value={handleToDecrypt}
            onChange={(e) => setHandleToDecrypt(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDecrypt}
          disabled={!isFHEReady || !signer || isDecrypting || !handleToDecrypt}
        >
          {isDecrypting ? <span className="loading" /> : 'Decrypt with EIP-712 Signature'}
        </button>

        {decryptResult && (
          <div className="result-box success">
            <h3>Decrypted Value:</h3>
            <p><strong>String:</strong> {decryptResult.value}</p>
            {decryptResult.numberValue !== undefined && (
              <p><strong>Number:</strong> {decryptResult.numberValue}</p>
            )}
            {decryptResult.boolValue !== undefined && (
              <p><strong>Boolean:</strong> {decryptResult.boolValue.toString()}</p>
            )}
          </div>
        )}

        {decryptError && (
          <div className="result-box error">
            <p>{decryptError.message}</p>
          </div>
        )}
      </div>

      {/* SDK Features Section */}
      <div className="card">
        <h2>✨ SDK Features Demonstrated</h2>
        <ul style={{ lineHeight: '2', color: '#666' }}>
          <li>✅ <strong>FHE Provider Context</strong> - Wrapped app with FHEProviderComponent</li>
          <li>✅ <strong>Initialization Hook</strong> - useFHEInitialized() for ready state</li>
          <li>✅ <strong>Encryption Hooks</strong> - Type-safe hooks for all FHE types</li>
          <li>✅ <strong>Decryption Hook</strong> - useDecrypt() with EIP-712 signatures</li>
          <li>✅ <strong>Wallet Integration</strong> - MetaMask connection with ethers.js</li>
          <li>✅ <strong>Loading States</strong> - Built-in loading indicators</li>
          <li>✅ <strong>Error Handling</strong> - Automatic error state management</li>
          <li>✅ <strong>TypeScript</strong> - Full type safety throughout</li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', color: 'white', marginTop: '3rem', opacity: 0.8 }}>
        <p>Built with @fhevm/sdk - Next.js Integration Example</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Network: Sepolia Testnet | Gateway v2.0
        </p>
      </div>
    </div>
  );
}
