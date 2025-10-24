/**
 * Encryption Demo Component
 * Interactive demo for FHE encryption
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import type { FHEType } from '@/types/fhe';

const ENCRYPTION_TYPES: { value: FHEType; label: string; max?: number }[] = [
  { value: 'bool', label: 'Boolean (true/false)' },
  { value: 'uint8', label: 'Uint8 (0-255)', max: 255 },
  { value: 'uint16', label: 'Uint16 (0-65535)', max: 65535 },
  { value: 'uint32', label: 'Uint32 (0-4.2B)', max: 4294967295 },
];

export function EncryptionDemo() {
  const { encrypt, encryptedData, isEncrypting, error, reset } = useEncryption();
  const [value, setValue] = useState('');
  const [selectedType, setSelectedType] = useState<FHEType>('uint32');

  const handleEncrypt = async () => {
    if (!value) return;

    const selectedTypeConfig = ENCRYPTION_TYPES.find(t => t.value === selectedType);

    if (selectedType === 'bool') {
      const boolValue = value.toLowerCase() === 'true' || value === '1';
      await encrypt(boolValue, selectedType);
    } else {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return;
      }
      if (selectedTypeConfig?.max && numValue > selectedTypeConfig.max) {
        return;
      }
      await encrypt(numValue, selectedType);
    }
  };

  const handleReset = () => {
    setValue('');
    reset();
  };

  return (
    <Card
      title="🔒 Encryption Demo"
      description="Encrypt values using Fully Homomorphic Encryption"
    >
      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Encryption Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as FHEType);
              setValue('');
              reset();
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ENCRYPTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value Input */}
        <Input
          label="Value to Encrypt"
          type={selectedType === 'bool' ? 'text' : 'number'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={selectedType === 'bool' ? 'true or false' : 'Enter a number'}
          max={ENCRYPTION_TYPES.find(t => t.value === selectedType)?.max}
          error={error?.message}
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleEncrypt}
            disabled={!value || isEncrypting}
            isLoading={isEncrypting}
          >
            Encrypt Value
          </Button>
          {encryptedData && (
            <Button onClick={handleReset} variant="secondary">
              Reset
            </Button>
          )}
        </div>

        {/* Encrypted Result */}
        {encryptedData && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ Encrypted Successfully!</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Type: </span>
                <span className="text-sm text-gray-900 font-mono">{encryptedData.type}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Ciphertext: </span>
                <code className="block mt-1 p-2 bg-white border border-green-300 rounded text-xs text-gray-800 break-all">
                  {encryptedData.data.slice(0, 100)}...
                </code>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                ℹ️ This encrypted data can now be used in smart contract operations without revealing the original value.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
