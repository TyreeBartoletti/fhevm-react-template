/**
 * Deployment script for CropYieldOptimizer v2.0
 * Supports new Gateway contract specifications with NUM_PAUSERS and PAUSER_ADDRESS_[0-N]
 */

const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🌾 Starting CropYieldOptimizer v2.0 deployment...\n");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Deploying from address:", deployer.address);
    console.log("💰 Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    // Load configuration from environment
    const NUM_PAUSERS = parseInt(process.env.NUM_PAUSERS || "4");
    const KMS_GENERATION = parseInt(process.env.KMS_GENERATION || "1");

    console.log("\n⚙️  Configuration:");
    console.log("   - Number of pausers:", NUM_PAUSERS);
    console.log("   - KMS Generation:", KMS_GENERATION);

    // Collect pauser addresses from environment
    const pauserAddresses = [];
    for (let i = 0; i < NUM_PAUSERS; i++) {
        const pauserKey = `PAUSER_ADDRESS_${i}`;
        const pauserAddress = process.env[pauserKey];

        if (!pauserAddress) {
            console.error(`❌ Error: ${pauserKey} is not defined in .env file`);
            process.exit(1);
        }

        // Validate address format
        if (!hre.ethers.isAddress(pauserAddress)) {
            console.error(`❌ Error: ${pauserKey} is not a valid Ethereum address: ${pauserAddress}`);
            process.exit(1);
        }

        pauserAddresses.push(pauserAddress);
        console.log(`   - Pauser ${i}:`, pauserAddress);
    }

    console.log("\n📝 Deploying CropYieldOptimizer contract...");

    // Deploy the contract
    const CropYieldOptimizer = await hre.ethers.getContractFactory("CropYieldOptimizer");
    const cropYieldOptimizer = await CropYieldOptimizer.deploy(
        pauserAddresses,
        KMS_GENERATION
    );

    await cropYieldOptimizer.waitForDeployment();
    const contractAddress = await cropYieldOptimizer.getAddress();

    console.log("\n✅ CropYieldOptimizer deployed successfully!");
    console.log("📍 Contract address:", contractAddress);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const owner = await cropYieldOptimizer.owner();
    const kmsGen = await cropYieldOptimizer.kmsGeneration();
    const pauserCount = await cropYieldOptimizer.getPauserCount();
    const isPaused = await cropYieldOptimizer.isPaused;

    console.log("   - Owner:", owner);
    console.log("   - KMS Generation:", kmsGen.toString());
    console.log("   - Pauser count:", pauserCount.toString());
    console.log("   - Is Paused:", isPaused);

    // Verify pausers
    console.log("\n🔐 Verifying pauser addresses:");
    for (let i = 0; i < pauserCount; i++) {
        const pauser = await cropYieldOptimizer.getPauserAtIndex(i);
        const isPauserActive = await cropYieldOptimizer.isPauserAddress(pauser);
        console.log(`   - Pauser ${i}: ${pauser} (Active: ${isPauserActive})`);
    }

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: contractAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        configuration: {
            numPausers: NUM_PAUSERS,
            kmsGeneration: KMS_GENERATION,
            pauserAddresses: pauserAddresses
        },
        verificationCommand: `npx hardhat verify --network ${hre.network.name} ${contractAddress} "${JSON.stringify(pauserAddresses)}" ${KMS_GENERATION}`
    };

    const fs = require('fs');
    fs.writeFileSync(
        'deployment-info.json',
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n💾 Deployment info saved to deployment-info.json");

    // Display verification command
    console.log("\n🔍 To verify on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} \\`);
    console.log(`  '${JSON.stringify(pauserAddresses)}' \\`);
    console.log(`  ${KMS_GENERATION}`);

    console.log("\n✨ Deployment completed successfully! ✨\n");

    // Display migration notes
    console.log("📋 Migration Notes:");
    console.log("   ✓ NUM_PAUSERS configuration implemented");
    console.log("   ✓ PAUSER_ADDRESS_[0-N] addressing implemented");
    console.log("   ✓ kmsGeneration (renamed from kmsManagement)");
    console.log("   ✓ Individual KMS decryption responses (no on-chain aggregation)");
    console.log("   ✓ check...() functions replaced with is...() boolean returns");
    console.log("   ✓ Transaction input re-randomization for sIND-CPAD security");
    console.log("   ✓ New Decryption events with separate KMS responses");
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
