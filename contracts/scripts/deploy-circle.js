const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    console.log("🔵 Deploying to Circle Layer Testnet...");
    console.log("Network:", hre.network.name);

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Get balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    if (balance === 0n) {
        console.error("❌ Account has no balance! Please fund your account first.");
        console.log("Fund your account at: https://testnet.circlelayer.com/faucet");
        process.exit(1);
    }

    // Deploy RegulatoryOracle contract
    console.log("\n⚖️ Deploying RegulatoryOracle...");
    const RegulatoryOracle = await ethers.getContractFactory("RegulatoryOracle");

    console.log("Estimating gas for RegulatoryOracle deployment...");
    const oracleGasEstimate = await ethers.provider.estimateGas(
        RegulatoryOracle.getDeployTransaction(deployer.address)
    );
    console.log("Estimated gas:", oracleGasEstimate.toString());

    const regulatoryOracle = await RegulatoryOracle.deploy(deployer.address);
    console.log("Transaction hash:", regulatoryOracle.deploymentTransaction().hash);

    await regulatoryOracle.waitForDeployment();
    const oracleAddress = await regulatoryOracle.getAddress();
    console.log("✅ RegulatoryOracle deployed to:", oracleAddress);

    // Deploy TransactionMonitor contract
    console.log("\n🔍 Deploying TransactionMonitor...");
    const TransactionMonitor = await ethers.getContractFactory("TransactionMonitor");

    const monitorGasEstimate = await ethers.provider.estimateGas(
        TransactionMonitor.getDeployTransaction(deployer.address)
    );
    console.log("Estimated gas:", monitorGasEstimate.toString());

    const transactionMonitor = await TransactionMonitor.deploy(deployer.address);
    console.log("Transaction hash:", transactionMonitor.deploymentTransaction().hash);

    await transactionMonitor.waitForDeployment();
    const monitorAddress = await transactionMonitor.getAddress();
    console.log("✅ TransactionMonitor deployed to:", monitorAddress);

    // Deploy InstitutionalTreasury contract
    console.log("\n🏦 Deploying InstitutionalTreasury...");
    const InstitutionalTreasury = await ethers.getContractFactory("InstitutionalTreasury");

    const treasuryGasEstimate = await ethers.provider.estimateGas(
        InstitutionalTreasury.getDeployTransaction(deployer.address)
    );
    console.log("Estimated gas:", treasuryGasEstimate.toString());

    const institutionalTreasury = await InstitutionalTreasury.deploy(deployer.address);
    console.log("Transaction hash:", institutionalTreasury.deploymentTransaction().hash);

    await institutionalTreasury.waitForDeployment();
    const treasuryAddress = await institutionalTreasury.getAddress();
    console.log("✅ InstitutionalTreasury deployed to:", treasuryAddress);

    // Save deployment addresses
    const deploymentInfo = {
        network: hre.network.name,
        chainId: hre.network.config.chainId,
        deployer: deployer.address,
        deployerBalance: ethers.formatEther(balance),
        contracts: {
            RegulatoryOracle: oracleAddress,
            TransactionMonitor: monitorAddress,
            InstitutionalTreasury: treasuryAddress
        },
        gasEstimates: {
            RegulatoryOracle: oracleGasEstimate.toString(),
            TransactionMonitor: monitorGasEstimate.toString(),
            InstitutionalTreasury: treasuryGasEstimate.toString()
        },
        deployedAt: new Date().toISOString(),
        explorerUrls: {
            RegulatoryOracle: `https://explorer-testnet.circlelayer.com/address/${oracleAddress}`,
            TransactionMonitor: `https://explorer-testnet.circlelayer.com/address/${monitorAddress}`,
            InstitutionalTreasury: `https://explorer-testnet.circlelayer.com/address/${treasuryAddress}`
        }
    };

    const fs = require('fs');
    const filename = `./deployment-${hre.network.name}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n🎉 All contracts deployed successfully to Circle Layer Testnet!");
    console.log(`📄 Deployment info saved to ${filename}`);

    console.log("\n📋 Contract Addresses Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔵 Network:", hre.network.name);
    console.log("🆔 Chain ID:", hre.network.config.chainId);
    console.log("👤 Deployer:", deployer.address);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚖️  RegulatoryOracle:     ", oracleAddress);
    console.log("🔍 TransactionMonitor:    ", monitorAddress);
    console.log("🏦 InstitutionalTreasury: ", treasuryAddress);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n🔗 Explorer Links:");
    console.log("RegulatoryOracle:     ", deploymentInfo.explorerUrls.RegulatoryOracle);
    console.log("TransactionMonitor:   ", deploymentInfo.explorerUrls.TransactionMonitor);
    console.log("InstitutionalTreasury:", deploymentInfo.explorerUrls.InstitutionalTreasury);

    // Run setup script
    console.log("\n🔧 Would you like to run the setup script to configure the contracts? (Run manually with: npx hardhat run scripts/setup-circle.js --network circleTestnet)");

    return deploymentInfo;
}

main()
    .then((deploymentInfo) => {
        console.log("\n✅ Deployment completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
