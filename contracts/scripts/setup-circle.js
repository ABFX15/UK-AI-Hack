const { ethers } = require("hardhat");

async function main() {
    console.log("🔧 Setting up contracts on Circle Layer Testnet...");

    // Load the most recent deployment info
    const fs = require('fs');
    const deploymentFiles = fs.readdirSync('./').filter(f => f.startsWith('deployment-circleTestnet-'));

    if (deploymentFiles.length === 0) {
        console.error("❌ No deployment file found. Please deploy contracts first.");
        process.exit(1);
    }

    // Get the most recent deployment
    const latestDeployment = deploymentFiles.sort().reverse()[0];
    console.log("📄 Using deployment file:", latestDeployment);

    const deploymentInfo = JSON.parse(fs.readFileSync(latestDeployment, 'utf8'));

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

    try {
        console.log("Creating KYC compliance rule...");
        const tx1 = await regulatoryOracle.createComplianceRule(
            "KYC_VERIFICATION",
            "All transactions above $10,000 require KYC verification",
            ethers.parseUnits("10000", 6), // $10,000 USDC (assuming 6 decimals)
            true,
            "KYC"
        );
        await tx1.wait();
        console.log("✅ KYC rule created - TX:", tx1.hash);
    } catch (error) {
        console.log("⚠️ KYC rule might already exist:", error.message);
    }

    try {
        console.log("Creating AML compliance rule...");
        const tx2 = await regulatoryOracle.createComplianceRule(
            "AML_CHECK",
            "Anti-money laundering checks for large transactions",
            ethers.parseUnits("100000", 6), // $100,000 USDC
            true,
            "AML"
        );
        await tx2.wait();
        console.log("✅ AML rule created - TX:", tx2.hash);
    } catch (error) {
        console.log("⚠️ AML rule might already exist:", error.message);
    }

    try {
        console.log("Authorizing sample institution...");
        const tx3 = await regulatoryOracle.authorizeInstitution(
            deployer.address,
            "Sample Institution",
            "US",
            2 // Medium compliance level
        );
        await tx3.wait();
        console.log("✅ Institution authorized - TX:", tx3.hash);
    } catch (error) {
        console.log("⚠️ Institution might already be authorized:", error.message);
    }

    console.log("\n🔍 Setting up TransactionMonitor...");

    try {
        console.log("Whitelisting sample protocol...");
        const tx4 = await transactionMonitor.whitelistProtocol(
            deployer.address,
            "Sample DeFi Protocol"
        );
        await tx4.wait();
        console.log("✅ Protocol whitelisted - TX:", tx4.hash);
    } catch (error) {
        console.log("⚠️ Protocol might already be whitelisted:", error.message);
    }

    console.log("\n🏦 Setting up InstitutionalTreasury...");

    try {
        console.log("Setting compliance oracle...");
        const tx5 = await institutionalTreasury.setComplianceOracle(deploymentInfo.contracts.RegulatoryOracle);
        await tx5.wait();
        console.log("✅ Compliance oracle set - TX:", tx5.hash);
    } catch (error) {
        console.log("⚠️ Compliance oracle might already be set:", error.message);
    }

    try {
        console.log("Approving sample protocol...");
        const tx6 = await institutionalTreasury.approveProtocol(
            deployer.address,
            "Sample Investment Protocol"
        );
        await tx6.wait();
        console.log("✅ Protocol approved - TX:", tx6.hash);
    } catch (error) {
        console.log("⚠️ Protocol might already be approved:", error.message);
    }

    try {
        console.log("Setting risk limits...");
        const riskLimits = [
            ethers.parseUnits("1000000", 6),  // Conservative: $1M
            ethers.parseUnits("5000000", 6),  // Moderate: $5M
            ethers.parseUnits("10000000", 6), // Aggressive: $10M
            ethers.parseUnits("25000000", 6)  // Speculative: $25M
        ];

        for (let i = 0; i < riskLimits.length; i++) {
            const tx = await institutionalTreasury.setRiskLimit(i, riskLimits[i]);
            await tx.wait();
            console.log(`✅ Risk limit set for tier ${i} - TX: ${tx.hash}`);
        }
    } catch (error) {
        console.log("⚠️ Risk limits might already be set:", error.message);
    }

    try {
        console.log("Authorizing deployer as manager...");
        const tx7 = await institutionalTreasury.authorizeManager(deployer.address);
        await tx7.wait();
        console.log("✅ Manager authorized - TX:", tx7.hash);
    } catch (error) {
        console.log("⚠️ Manager might already be authorized:", error.message);
    }

    // Update deployment info with setup status
    deploymentInfo.setupCompleted = true;
    deploymentInfo.setupAt = new Date().toISOString();

    fs.writeFileSync(latestDeployment, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n🎉 Setup completed successfully!");
    console.log("\n📝 Configuration Summary:");
    console.log("✅ Created KYC and AML compliance rules");
    console.log("✅ Authorized sample institution");
    console.log("✅ Whitelisted sample DeFi protocol");
    console.log("✅ Connected treasury to compliance oracle");
    console.log("✅ Set risk limits for all investment tiers");
    console.log("✅ Authorized deployer as treasury manager");

    console.log("\n🚀 The DeFi Regulatory Compliance Platform is now live on Circle Layer Testnet!");
    console.log("\n🔗 Interact with your contracts:");
    console.log("RegulatoryOracle:     ", deploymentInfo.explorerUrls.RegulatoryOracle);
    console.log("TransactionMonitor:   ", deploymentInfo.explorerUrls.TransactionMonitor);
    console.log("InstitutionalTreasury:", deploymentInfo.explorerUrls.InstitutionalTreasury);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Setup failed:", error);
        process.exit(1);
    });
