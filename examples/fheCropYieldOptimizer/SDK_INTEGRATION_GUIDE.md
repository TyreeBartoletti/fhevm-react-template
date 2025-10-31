# SDK Integration Guide for Crop Yield Optimizer

This guide shows how to integrate the `@fhevm/sdk` into the Crop Yield Optimizer vanilla JavaScript application.

## Current Status

The application currently uses direct contract calls without client-side FHE encryption. This guide shows how to add SDK integration for enhanced privacy.

## Installation

The SDK is already added as a dependency in `package.json`:

```json
{
  "dependencies": {
    "@fhevm/sdk": "workspace:*",
    "ethers": "^5.7.2"
  }
}
```

## Integration Steps

### Step 1: Initialize FHE SDK

Replace the placeholder `initializeFHESDK()` function with actual SDK initialization:

```javascript
// Import SDK (if using modules)
import { createProvider } from '@fhevm/sdk';

// Or use via CDN (already loaded in index.html)
let fheProvider;

async function initializeFHESDK() {
    try {
        // Create FHE provider
        fheProvider = createProvider();

        // Initialize with network config
        await fheProvider.initialize({
            chainId: 11155111, // Sepolia testnet
            gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
        });

        console.log('FHE SDK initialized successfully');
        return true;
    } catch (error) {
        console.error('FHE SDK initialization failed:', error);
        return false;
    }
}
```

### Step 2: Encrypt Farm Data Before Submission

Modify the `submitFarmData()` function to encrypt sensitive agricultural data:

```javascript
async function submitFarmData() {
    if (!contract || !fheProvider) {
        alert('Please connect wallet and initialize FHE first');
        return;
    }

    try {
        // Get form values
        const soilQuality = parseInt(document.getElementById('soilQuality').value);
        const waterUsage = parseInt(document.getElementById('waterUsage').value);
        const fertilizerUsage = parseInt(document.getElementById('fertilizerUsage').value);
        const yieldAmount = parseInt(document.getElementById('yieldAmount').value);
        const cropType = parseInt(document.getElementById('cropType').value);

        // Encrypt sensitive data using SDK
        const encryptedSoil = await fheProvider.encryptUint32(soilQuality);
        const encryptedWater = await fheProvider.encryptUint32(waterUsage);
        const encryptedFertilizer = await fheProvider.encryptUint32(fertilizerUsage);
        const encryptedYield = await fheProvider.encryptUint32(yieldAmount);
        const encryptedCropType = await fheProvider.encryptUint8(cropType);

        showStatus('dataStatus', 'Submitting encrypted farm data...', 'info');

        // Submit encrypted data to contract
        const tx = await contract.submitFarmData(
            encryptedSoil.data,
            encryptedWater.data,
            encryptedFertilizer.data,
            encryptedYield.data,
            encryptedCropType.data
        );

        await tx.wait();

        showStatus('dataStatus', 'Farm data submitted successfully! Your data is encrypted on-chain.', 'success');
        await refreshStats();
    } catch (error) {
        showStatus('dataStatus', 'Failed to submit data: ' + error.message, 'error');
    }
}
```

### Step 3: Decrypt Recommendations

Add decryption functionality to view personalized recommendations:

```javascript
async function getRecommendations() {
    if (!contract || !fheProvider) {
        alert('Please connect wallet and initialize FHE first');
        return;
    }

    const analysisId = document.getElementById('analysisId').value;

    if (!analysisId) {
        alert('Please enter analysis ID');
        return;
    }

    try {
        // Get encrypted recommendations from contract
        const result = await contract.getPersonalizedRecommendations(analysisId);

        // Decrypt using SDK with EIP-712 signature
        const decryptedSoil = await fheProvider.userDecrypt({
            handle: result.soilTreatment,
            contractAddress: CONTRACT_ADDRESS,
            signer: signer
        });

        const decryptedWater = await fheProvider.userDecrypt({
            handle: result.waterAmount,
            contractAddress: CONTRACT_ADDRESS,
            signer: signer
        });

        const decryptedFertilizer = await fheProvider.userDecrypt({
            handle: result.fertilizerAmount,
            contractAddress: CONTRACT_ADDRESS,
            signer: signer
        });

        const decryptedYieldIncrease = await fheProvider.userDecrypt({
            handle: result.yieldIncrease,
            contractAddress: CONTRACT_ADDRESS,
            signer: signer
        });

        // Display decrypted results
        document.getElementById('recommendationsResult').style.display = 'block';
        document.getElementById('soilRecommendation').textContent = decryptedSoil.numberValue + ' units';
        document.getElementById('waterRecommendation').textContent = decryptedWater.numberValue + ' liters';
        document.getElementById('fertilizerRecommendation').textContent = decryptedFertilizer.numberValue + ' kg';
        document.getElementById('yieldIncrease').textContent = '+' + decryptedYieldIncrease.numberValue + '%';

    } catch (error) {
        alert('Failed to get recommendations: ' + error.message);
    }
}
```

### Step 4: Update Wallet Connection

Ensure FHE SDK is initialized when wallet connects:

```javascript
async function connectWallet() {
    if (typeof ethers === 'undefined') {
        alert('Ethers.js library failed to load. Please refresh the page.');
        return;
    }

    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            userAccount = await signer.getAddress();

            document.getElementById('farmAddress').value = userAccount;
            document.getElementById('registerBtn').disabled = false;

            // Initialize contract
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Initialize FHE SDK
            const fheInitialized = await initializeFHESDK();

            if (fheInitialized) {
                showStatus('registerStatus', 'Wallet connected and FHE initialized!', 'success');
            } else {
                showStatus('registerStatus', 'Wallet connected but FHE initialization failed', 'warning');
            }

            // Check if farm is already registered
            const isRegistered = await contract.isFarmRegistered(userAccount);
            if (isRegistered) {
                showStatus('registerStatus', 'Farm is already registered!', 'success');
            }

        } catch (error) {
            showStatus('registerStatus', 'Wallet connection failed: ' + error.message, 'error');
        }
    } else {
        alert('Please install MetaMask wallet');
    }
}
```

## Complete Integration Example

Here's a complete implementation example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>FHE Crop Optimizer with SDK</title>
</head>
<body>
    <!-- Your existing HTML -->

    <!-- Load dependencies -->
    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>

    <!-- Load SDK via CDN or build tool -->
    <script type="module">
        import { createProvider } from '@fhevm/sdk';

        let provider, signer, contract, userAccount, fheProvider;
        const CONTRACT_ADDRESS = "0xf2301736A15a5152401E968cB8d995c0F508f568";

        // Initialize FHE SDK
        async function initializeFHESDK() {
            try {
                fheProvider = createProvider();
                await fheProvider.initialize({
                    chainId: 11155111,
                    gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
                });
                console.log('FHE SDK initialized');
                return true;
            } catch (error) {
                console.error('FHE init failed:', error);
                return false;
            }
        }

        // Submit encrypted farm data
        async function submitFarmData() {
            const soilQuality = parseInt(document.getElementById('soilQuality').value);
            const waterUsage = parseInt(document.getElementById('waterUsage').value);
            const fertilizerUsage = parseInt(document.getElementById('fertilizerUsage').value);
            const yieldAmount = parseInt(document.getElementById('yieldAmount').value);
            const cropType = parseInt(document.getElementById('cropType').value);

            // Encrypt with SDK
            const encrypted = await Promise.all([
                fheProvider.encryptUint32(soilQuality),
                fheProvider.encryptUint32(waterUsage),
                fheProvider.encryptUint32(fertilizerUsage),
                fheProvider.encryptUint32(yieldAmount),
                fheProvider.encryptUint8(cropType)
            ]);

            // Submit to contract
            const tx = await contract.submitFarmData(
                encrypted[0].data,
                encrypted[1].data,
                encrypted[2].data,
                encrypted[3].data,
                encrypted[4].data
            );

            await tx.wait();
            alert('Data submitted successfully with FHE encryption!');
        }

        // Make functions available globally
        window.initializeFHESDK = initializeFHESDK;
        window.submitFarmData = submitFarmData;
    </script>
</body>
</html>
```

## Benefits of SDK Integration

1. **Client-Side Encryption**: All sensitive data is encrypted in the browser before sending to blockchain
2. **Type Safety**: SDK provides TypeScript types for all FHE operations
3. **Easy Decryption**: Built-in EIP-712 signature support for secure decryption
4. **Better Privacy**: Agricultural data remains confidential throughout the entire process
5. **Simplified API**: Clean, consistent interface for all FHE operations

## Testing the Integration

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start local server:
   ```bash
   npm start
   ```

3. Connect MetaMask to Sepolia testnet

4. Test encryption:
   - Click "Connect Wallet"
   - Verify FHE SDK initializes
   - Submit farm data
   - Check that encrypted data is sent to contract

5. Test decryption:
   - Run collaborative analysis
   - Get recommendations
   - Verify decrypted values display correctly

## Smart Contract Compatibility

Ensure your smart contract uses FHE-compatible types:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/contracts/FHE.sol";

contract CropYieldOptimizer {
    struct FarmData {
        euint32 soilQuality;
        euint32 waterUsage;
        euint32 fertilizerUsage;
        euint32 yieldAmount;
        euint8 cropType;
    }

    function submitFarmData(
        einput _soilQuality,
        einput _waterUsage,
        einput _fertilizerUsage,
        einput _yieldAmount,
        einput _cropType,
        bytes calldata inputProof
    ) external {
        FarmData memory data = FarmData({
            soilQuality: FHE.asEuint32(_soilQuality, inputProof),
            waterUsage: FHE.asEuint32(_waterUsage, inputProof),
            fertilizerUsage: FHE.asEuint32(_fertilizerUsage, inputProof),
            yieldAmount: FHE.asEuint32(_yieldAmount, inputProof),
            cropType: FHE.asEuint8(_cropType, inputProof)
        });

        // Store encrypted data...
    }
}
```

## Additional Resources

- [SDK Documentation](../../packages/fhevm-sdk/README.md)
- [API Reference](../../docs/API.md)
- [Quick Start Guide](../../docs/QUICK_START.md)
- [Next.js Example](../nextjs-demo/) - Full React integration

## Support

For issues or questions about SDK integration:
- Check the [SDK README](../../packages/fhevm-sdk/README.md)
- Review [example implementation](../nextjs-demo/src/lib/fhe/client.ts)
- Open an issue on GitHub
