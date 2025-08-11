const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying DeFi Regulatory Compliance Platform...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // Deploy RegulatoryOracle contract
    console.log("\n� Deploying RegulatoryOracle...");
    const RegulatoryOracle = await ethers.getContractFactory("RegulatoryOracle");
    const regulatoryOracle = await RegulatoryOracle.deploy(deployer.address);
    await regulatoryOracle.waitForDeployment();
    const oracleAddress = await regulatoryOracle.getAddress();
    console.log("✅ RegulatoryOracle deployed to:", oracleAddress);

    // Deploy TransactionMonitor contract
    console.log("\n🔍 Deploying TransactionMonitor...");
    const TransactionMonitor = await ethers.getContractFactory("TransactionMonitor");
    const transactionMonitor = await TransactionMonitor.deploy(deployer.address);
    await transactionMonitor.waitForDeployment();
    const monitorAddress = await transactionMonitor.getAddress();
    console.log("✅ TransactionMonitor deployed to:", monitorAddress);

    // Deploy InstitutionalTreasury contract
    console.log("\n� Deploying InstitutionalTreasury...");
    const InstitutionalTreasury = await ethers.getContractFactory("InstitutionalTreasury");
    const institutionalTreasury = await InstitutionalTreasury.deploy(deployer.address);
    await institutionalTreasury.waitForDeployment();
    const treasuryAddress = await institutionalTreasury.getAddress();
    console.log("✅ InstitutionalTreasury deployed to:", treasuryAddress);

    // Save deployment addresses
    const deploymentInfo = {
        network: hre.network.name,
        deployer: deployer.address,
        contracts: {
            RegulatoryOracle: oracleAddress,
            TransactionMonitor: monitorAddress,
            InstitutionalTreasury: treasuryAddress
        },
        deployedAt: new Date().toISOString()
    };

    const fs = require('fs');
    fs.writeFileSync(
        './deployment.json',
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n🎉 All contracts deployed successfully!");
    console.log("📄 Deployment info saved to deployment.json");

    // Verify contracts on Circle (if not localhost)
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
        console.log("\n🔍 Verifying contracts...");

        try {
            await hre.run("verify:verify", {
                address: oracleAddress,
                constructorArguments: [deployer.address]
            });
            console.log("✅ RegulatoryOracle verified");
        } catch (error) {
            console.log("❌ RegulatoryOracle verification failed:", error.message);
        }

        try {
            await hre.run("verify:verify", {
                address: monitorAddress,
                constructorArguments: [deployer.address]
            });
            console.log("✅ TransactionMonitor verified");
        } catch (error) {
            console.log("❌ TransactionMonitor verification failed:", error.message);
        }

        try {
            await hre.run("verify:verify", {
                address: treasuryAddress,
                constructorArguments: [deployer.address]
            });
            console.log("✅ InstitutionalTreasury verified");
        } catch (error) {
            console.log("❌ InstitutionalTreasury verification failed:", error.message);
        }
    }

    console.log("\n📋 Contract Addresses Summary:");
    console.log("RegulatoryOracle:", oracleAddress);
    console.log("TransactionMonitor:", monitorAddress);
    console.log("InstitutionalTreasury:", treasuryAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
