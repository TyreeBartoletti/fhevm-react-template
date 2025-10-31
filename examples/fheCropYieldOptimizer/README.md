# 🌾 Confidential Crop Yield Optimizer

> Privacy-Preserving Agricultural Data Collaboration Platform
>
> **SDK Integration Available**: See [SDK_INTEGRATION_GUIDE.md](./SDK_INTEGRATION_GUIDE.md) for @fhevm/sdk integration instructions

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tyreebartoletti.github.io/fheCropYieldOptimizer/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Sepolia](https://img.shields.io/badge/network-Sepolia-purple)](https://sepolia.etherscan.io/)

## 🎯 Core Concept

**Confidential Agricultural Yield Optimization** - An innovative agricultural data analysis platform that enables multiple farms to share planting data for encrypted computation, obtaining optimal planting recommendations without exposing their respective commercial secrets.

This breakthrough platform allows agricultural cooperatives to collaborate on data-driven decision making while maintaining complete privacy of their proprietary farming data through advanced Fully Homomorphic Encryption (FHE) technology.

## 🎥 Demo

**Live Application**: [https://tyreebartoletti.github.io/fheCropYieldOptimizer/](https://tyreebartoletti.github.io/fheCropYieldOptimizer/)

**Video Demonstration**: Available in the repository showcasing complete platform functionality and user workflow

## 🔑 Key Features

### Privacy-First Architecture
- 🔒 **Complete Data Confidentiality**: All agricultural data is homomorphically encrypted before sharing
- 🛡️ **Zero-Knowledge Collaboration**: Farms contribute to insights without exposing individual data
- 🔐 **End-to-End Encryption**: Data remains encrypted throughout the entire computation process

### Collaborative Intelligence
- 🤝 **Multi-Farm Analysis**: Aggregate insights from multiple farms without data exposure
- 📊 **Smart Recommendations**: AI-powered optimization based on encrypted collective datasets
- 🎯 **Personalized Results**: Each farm receives tailored recommendations while data stays private

### Advanced Technology
- 🚀 **Zama FHE Integration**: State-of-the-art Fully Homomorphic Encryption technology
- ⛓️ **Blockchain-Based**: Decentralized architecture eliminating single points of failure
- 🌐 **Web3 Integration**: Seamless MetaMask wallet connectivity
- 💡 **Gateway v2.0 Compliant**: Latest FHE protocol specifications

## 🏗️ Architecture

### Smart Contract
- **Network**: Ethereum Sepolia Testnet
- **Contract Address**: `0xf2301736A15a5152401E968cB8d995c0F508f568`
- **Verification**: [View on Etherscan](https://sepolia.etherscan.io/address/0xf2301736A15a5152401E968cB8d995c0F508f568)

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Smart Contracts**: Solidity 0.8.24
- **Blockchain**: Ethereum-compatible networks
- **Encryption**: Zama fhEVM v0.9.0
- **Web3**: Ethers.js v5.7.2
- **SDK Integration**: Optional @fhevm/sdk support (commented in code)
- **Deployment**: GitHub Pages
- **Development**: Hardhat, Node.js

## 🔧 SDK Integration Guide

### Using @fhevm/sdk (Optional Enhancement)

This example can be enhanced with the @fhevm/sdk for type-safe FHE operations:

#### 1. Install the SDK
```bash
npm install @fhevm/sdk ethers
```

#### 2. Initialize FHE Provider
```javascript
import { createProvider } from '@fhevm/sdk';

const fheProvider = createProvider();
await fheProvider.initialize({
  chainId: 11155111, // Sepolia
  gatewayAddress: '0x33347831500F1e73f102414fAf8fD6b494F06a10'
});
```

#### 3. Encrypt Agricultural Data
```javascript
// Instead of plain values, encrypt using FHE
const encryptedSoil = await fheProvider.encryptUint32(soilQuality);
const encryptedWater = await fheProvider.encryptUint32(waterUsage);
const encryptedFertilizer = await fheProvider.encryptUint32(fertilizerUsage);
const encryptedYield = await fheProvider.encryptUint32(yieldAmount);

// Submit encrypted data to contract
await contract.submitFarmData(
  encryptedSoil.data,
  encryptedWater.data,
  encryptedFertilizer.data,
  encryptedYield.data,
  cropType
);
```

#### 4. Decrypt Recommendations
```javascript
// Decrypt personalized recommendations with EIP-712 signature
const result = await fheProvider.userDecrypt({
  handle: recommendationHandle,
  contractAddress: CONTRACT_ADDRESS,
  signer: signer
});

console.log('Decrypted recommendation:', result.numberValue);
```

### Current Implementation
The current `index.html` implementation uses vanilla JavaScript with ethers.js for simplicity and broad compatibility. SDK integration code is included as comments in the source for developers who want to add type-safe FHE operations.

## 🔬 How It Works

### Workflow

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Farm A    │      │    Farm B    │      │   Farm C    │
│  (Private)  │      │  (Private)   │      │  (Private)  │
└──────┬──────┘      └──────┬───────┘      └──────┬──────┘
       │                    │                     │
       │ Encrypt Data       │ Encrypt Data        │ Encrypt Data
       ▼                    ▼                     ▼
┌──────────────────────────────────────────────────────────┐
│           FHE-Enabled Smart Contract (Blockchain)        │
│  Performs Homomorphic Computation on Encrypted Data      │
└──────────────────────────────────────────────────────────┘
       │                    │                     │
       │ Private Results    │ Private Results     │ Private Results
       ▼                    ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌─────────────┐
│ Personalized │      │ Personalized │      │Personalized │
│Recommendations│      │Recommendations│      │Recommendations│
└──────────────┘      └──────────────┘      └─────────────┘
```

### Process Steps

1. **Farm Registration**: Agricultural operators register their farms using Web3 wallets
2. **Data Encryption**: Sensitive farming data (soil quality, water usage, fertilizer, yield) is encrypted locally using FHE
3. **Secure Sharing**: Encrypted data is submitted to the blockchain smart contract
4. **Homomorphic Computation**: Advanced FHE algorithms process encrypted data without ever decrypting it
5. **Private Results**: Each farm receives personalized optimization recommendations while all data remains confidential

## 💼 Use Cases

### Yield Optimization
- Analyze historical yield data across multiple farms collaboratively
- Identify optimal planting strategies without revealing individual farm performance
- Generate region-specific recommendations based on aggregated encrypted insights

### Resource Management
- Optimize water usage across different soil types and weather conditions
- Share irrigation strategies while protecting proprietary techniques
- Coordinate fertilizer application timing for maximum efficiency
- Reduce resource waste through collective intelligence

### Risk Assessment
- Collaborative pest and disease prediction models
- Weather pattern analysis for crop selection
- Insurance optimization based on encrypted risk profiles
- Supply chain coordination without data exposure

## 🔐 Privacy Guarantees

Our platform ensures absolute privacy through:

- **Homomorphic Encryption**: Computations performed directly on encrypted data - no decryption needed
- **Selective Disclosure**: Only chosen metrics shared, always in encrypted form
- **Blockchain Audit Trail**: All interactions recorded on-chain without revealing data content
- **Access Control**: Individual farms maintain complete control over their data
- **sIND-CPAD Security**: Transaction input re-randomization for enhanced security
- **KMS Protection**: Key Management System with distributed pauser architecture

## 📈 Benefits

### For Individual Farms
✅ Access insights from larger datasets without losing competitive advantage
✅ Reduce R&D costs through collaborative analytics
✅ Evidence-based decision making with enhanced privacy
✅ Improve yields by learning from collective wisdom
✅ Maintain trade secrets while benefiting from cooperation

### For Agricultural Industry
✅ Accelerate innovation through secure data sharing
✅ Improve food security through optimized production
✅ Promote sustainable farming practices
✅ Enable industry-wide benchmarking without exposing individual performance
✅ Foster collaboration in traditionally competitive environments

### For Society
✅ Increased food production efficiency
✅ Reduced environmental impact through optimized resource usage
✅ Enhanced agricultural sustainability
✅ Democratized access to advanced farming analytics

## 🚀 Getting Started

### Prerequisites
- MetaMask wallet extension installed
- Sepolia ETH for gas fees (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- Modern web browser (Chrome, Firefox, Brave)

### Quick Start

1. **Visit the Platform**
   ```
   https://tyreebartoletti.github.io/fheCropYieldOptimizer/
   ```

2. **Connect Your Wallet**
   - Click "Connect MetaMask Wallet"
   - Approve the connection in MetaMask
   - Switch to Sepolia testnet if needed

3. **Register Your Farm**
   - Click "Register Farm" button
   - Confirm the transaction in MetaMask
   - Wait for blockchain confirmation

4. **Submit Agricultural Data**
   - Navigate to "Data Submission" tab
   - Enter your farming metrics (soil quality, water usage, fertilizer, yield, crop type)
   - Click "Submit Encrypted Data"
   - Your data is encrypted locally before submission

5. **Participate in Collaborative Analysis**
   - Wait for at least 3 farms to submit data
   - Navigate to "Collaborative Analysis" tab
   - Click "Start Collaborative Analysis"
   - The system performs FHE computation on all encrypted data

6. **Receive Personalized Recommendations**
   - Navigate to "Optimization Results" tab
   - Enter your analysis ID
   - View your customized farming recommendations

## 🛠️ Local Development

### Clone the Repository

```bash
git clone <your-repository-url>
cd fheCropYieldOptimizer
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file in the project directory:

```env
NETWORK=sepolia
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_rpc_url_here
```

### Run Locally

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Smart Contract Development

#### Compile Contracts
```bash
npx hardhat compile
```

#### Deploy to Sepolia
```bash
npx hardhat run deploy.js --network sepolia
```

#### Verify Contract
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## 📚 Smart Contract Features

### Core Functions

- `registerFarm()`: Register a new farm on the platform
- `submitFarmData(...)`: Submit encrypted agricultural data
- `startCollaborativeAnalysis()`: Initiate multi-farm encrypted analysis
- `getPersonalizedRecommendations(...)`: Retrieve your private results

### Gateway v2.0 Features

- ✅ Dynamic pauser management (`addPauser`, `removePauser`)
- ✅ Emergency pause functionality
- ✅ KMS generation tracking
- ✅ Decryption request/response system
- ✅ Individual KMS node responses (no on-chain aggregation)
- ✅ Boolean return functions (`isPublicDecryptAllowed`, `isAnalysisValid`)

### Security Features

- Multi-signature pauser architecture
- Transaction input re-randomization (sIND-CPAD)
- Access control mechanisms
- Emergency pause capabilities
- Audit event emissions

## 🌐 Links

- **Live Application**: [https://tyreebartoletti.github.io/FHECropYieldOptimizer/](https://tyreebartoletti.github.io/FHECropYieldOptimizer/)
- **Smart Contract**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xf2301736A15a5152401E968cB8d995c0F508f568)
- **Zama Documentation**: [https://docs.zama.ai/](https://docs.zama.ai/)
- **fhEVM Documentation**: [https://docs.fhevm.zama.ai/](https://docs.fhevm.zama.ai/)

## 🔮 Future Roadmap

- [ ] **IoT Integration**: Real-time data collection from field sensors
- [ ] **Machine Learning**: Predictive analytics on encrypted data
- [ ] **Mobile Application**: iOS and Android apps for field workers
- [ ] **Supply Chain Integration**: Connect with agricultural commodity markets
- [ ] **Livestock Support**: Expand to include animal husbandry optimization
- [ ] **Multi-Chain Deployment**: Support for additional blockchain networks
- [ ] **Advanced Analytics**: Weather prediction, pest forecasting, market timing
- [ ] **Community Governance**: DAO for platform decision-making

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

### Ways to Contribute
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🌍 Translate to other languages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For pioneering Fully Homomorphic Encryption technology
- **Ethereum Foundation**: For providing robust blockchain infrastructure
- **Agricultural Community**: For inspiring this privacy-preserving innovation

## 📞 Support

For questions, issues, or feedback:
- Open an issue on GitHub
- Join our community discussions
- Check the FAQ section in the live application

---

**Revolutionizing agriculture through privacy-preserving collaboration** 🌱

*Built with ❤️ for the global agricultural community*
