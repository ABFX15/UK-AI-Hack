const { ethers } = require("hardhat");

async function main() {
    console.log("🔧 Setting up deployed contracts with initial configuration...");

    // Load deployment info
    const fs = require('fs');
    let deploymentInfo;

    try {
        deploymentInfo = JSON.parse(fs.readFileSync('./deployment.json', 'utf8'));
    } catch (error) {
        console.error("❌ deployment.json not found. Please run deployment first.");
        process.exit(1);
    }

    const [deployer] = await ethers.getSigners();
    console.log("Setting up contracts with account:", deployer.address);

    // Get contract instances
    const RegulatoryOracle = await ethers.getContractFactory("RegulatoryOracle");
    const TransactionMonitor = await ethers.getContractFactory("TransactionMonitor");
    const InstitutionalTreasury = await ethers.getContractFactory("InstitutionalTreasury");

    const regulatoryOracle = RegulatoryOracle.attach(deploymentInfo.contracts.RegulatoryOracle);
    const transactionMonitor = TransactionMonitor.attach(deploymentInfo.contracts.TransactionMonitor);
    const institutionalTreasury = InstitutionalTreasury.attach(deploymentInfo.contracts.InstitutionalTreasury);

    console.log("\n📋 Setting up RegulatoryOracle...");

    // Create sample compliance rules
    try {
        await regulatoryOracle.createComplianceRule(
            "KYC_VERIFICATION",
            "All transactions above $10,000 require KYC verification",
            10000 * 10 ** 6, // $10,000 USDC
            true,
            "KYC"
        );
        console.log("✅ Created KYC compliance rule");
    } catch (error) {
        console.log("⚠️ KYC rule might already exist:", error.message);
    }

    try {
        await regulatoryOracle.createComplianceRule(
            "AML_CHECK",
            "Anti-money laundering checks for large transactions",
            100000 * 10 ** 6, // $100,000 USDC
            true,
            "AML"
        );
        console.log("✅ Created AML compliance rule");
    } catch (error) {
        console.log("⚠️ AML rule might already exist:", error.message);
    }

    // Authorize a sample institution
    try {
        await regulatoryOracle.authorizeInstitution(
            deployer.address,
            "Sample Institution",
            "US",
            2 // Medium compliance level
        );
        console.log("✅ Authorized sample institution");
    } catch (error) {
        console.log("⚠️ Institution might already be authorized:", error.message);
    }

    console.log("\n🔍 Setting up TransactionMonitor...");

    // Whitelist a sample protocol (using deployer address as example)
    try {
        await transactionMonitor.whitelistProtocol(
            deployer.address,
            "Sample DeFi Protocol"
        );
        console.log("✅ Whitelisted sample protocol");
    } catch (error) {
        console.log("⚠️ Protocol might already be whitelisted:", error.message);
    }

    console.log("\n🏦 Setting up InstitutionalTreasury...");

    // Set compliance oracle
    try {
        await institutionalTreasury.setComplianceOracle(deploymentInfo.contracts.RegulatoryOracle);
        console.log("✅ Set compliance oracle");
    } catch (error) {
        console.log("⚠️ Compliance oracle might already be set:", error.message);
    }

    // Approve sample protocol
    try {
        await institutionalTreasury.approveProtocol(
            deployer.address,
            "Sample Investment Protocol"
        );
        console.log("✅ Approved sample protocol for investments");
    } catch (error) {
        console.log("⚠️ Protocol might already be approved:", error.message);
    }

    // Set risk limits
    try {
        await institutionalTreasury.setRiskLimit(0, 1000000 * 10 ** 6); // Conservative: $1M
        await institutionalTreasury.setRiskLimit(1, 5000000 * 10 ** 6); // Moderate: $5M
        await institutionalTreasury.setRiskLimit(2, 10000000 * 10 ** 6); // Aggressive: $10M
        await institutionalTreasury.setRiskLimit(3, 25000000 * 10 ** 6); // Speculative: $25M
        console.log("✅ Set risk limits for all tiers");
    } catch (error) {
        console.log("⚠️ Risk limits might already be set:", error.message);
    }

    // Authorize the deployer as a manager
    try {
        await institutionalTreasury.authorizeManager(deployer.address);
        console.log("✅ Authorized deployer as manager");
    } catch (error) {
        console.log("⚠️ Manager might already be authorized:", error.message);
    }

    console.log("\n🎉 Setup completed successfully!");
    console.log("\n📝 Summary of configurations:");
    console.log("- Created KYC and AML compliance rules");
    console.log("- Authorized sample institution");
    console.log("- Whitelisted sample DeFi protocol");
    console.log("- Connected treasury to compliance oracle");
    console.log("- Set risk limits for all investment tiers");
    console.log("- Authorized deployer as treasury manager");

    console.log("\n🚀 The DeFi Regulatory Compliance Platform is now ready for use!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Setup failed:", error);
        process.exit(1);
    });
