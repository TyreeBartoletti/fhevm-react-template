/**
 * Banking Example Component
 * Demonstrates FHE in a banking/financial context
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Transaction {
  id: string;
  amount: number;
  encryptedAmount: string;
  timestamp: Date;
  type: 'deposit' | 'withdrawal';
}

export function BankingExample() {
  const { encrypt, isEncrypting } = useEncryption();
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(1000);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;

    const numAmount = Number(amount);
    const encrypted = await encrypt(numAmount, 'uint32');

    if (encrypted) {
      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        amount: numAmount,
        encryptedAmount: encrypted.data,
        timestamp: new Date(),
        type: 'deposit',
      };

      setTransactions([transaction, ...transactions]);
      setBalance(balance + numAmount);
      setAmount('');
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0 || Number(amount) > balance) return;

    const numAmount = Number(amount);
    const encrypted = await encrypt(numAmount, 'uint32');

    if (encrypted) {
      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        amount: numAmount,
        encryptedAmount: encrypted.data,
        timestamp: new Date(),
        type: 'withdrawal',
      };

      setTransactions([transaction, ...transactions]);
      setBalance(balance - numAmount);
      setAmount('');
    }
  };

  return (
    <Card
      title="🏦 Private Banking Demo"
      description="Confidential transactions using FHE"
    >
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
          <p className="text-sm opacity-90">Current Balance</p>
          <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-1">
            ℹ️ Actual balance would be encrypted on-chain
          </p>
        </div>

        {/* Transaction Form */}
        <div className="space-y-3">
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleDeposit}
              disabled={!amount || isEncrypting}
              isLoading={isEncrypting}
            >
              Deposit
            </Button>
            <Button
              onClick={handleWithdraw}
              variant="outline"
              disabled={!amount || isEncrypting || Number(amount) > balance}
              isLoading={isEncrypting}
            >
              Withdraw
            </Button>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Transaction History</h4>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-sm font-semibold ${
                        txn.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.type === 'deposit' ? '↓ Deposit' : '↑ Withdrawal'}
                      </span>
                      <p className="text-lg font-bold text-gray-900">
                        ${txn.amount.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {txn.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">Encrypted Amount:</p>
                    <code className="text-xs bg-white px-2 py-1 rounded border border-gray-300 block mt-1 truncate">
                      {txn.encryptedAmount.slice(0, 50)}...
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">🔐 Privacy Features</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Transaction amounts are encrypted before submission</li>
            <li>• Balance calculations happen on encrypted data</li>
            <li>• No third party can see transaction details</li>
            <li>• Computations verify correctness without revealing values</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
