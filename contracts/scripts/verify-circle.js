const { run } = require("hardhat");

async function main() {
    console.log("🔍 Verifying contracts on Circle Layer Explorer...");

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
    const deployer = deploymentInfo.deployer;

    console.log("🔍 Verifying RegulatoryOracle...");
    try {
        await run("verify:verify", {
            address: deploymentInfo.contracts.RegulatoryOracle,
            constructorArguments: [deployer],
            network: "circleTestnet"
        });
        console.log("✅ RegulatoryOracle verified");
    } catch (error) {
        console.log("⚠️ RegulatoryOracle verification failed:", error.message);
    }

    console.log("🔍 Verifying TransactionMonitor...");
    try {
        await run("verify:verify", {
            address: deploymentInfo.contracts.TransactionMonitor,
            constructorArguments: [deployer],
            network: "circleTestnet"
        });
        console.log("✅ TransactionMonitor verified");
    } catch (error) {
        console.log("⚠️ TransactionMonitor verification failed:", error.message);
    }

    console.log("🔍 Verifying InstitutionalTreasury...");
    try {
        await run("verify:verify", {
            address: deploymentInfo.contracts.InstitutionalTreasury,
            constructorArguments: [deployer],
            network: "circleTestnet"
        });
        console.log("✅ InstitutionalTreasury verified");
    } catch (error) {
        console.log("⚠️ InstitutionalTreasury verification failed:", error.message);
    }

    console.log("\n🎉 Contract verification completed!");
    console.log("\n🔗 View verified contracts:");
    console.log("RegulatoryOracle:     ", deploymentInfo.explorerUrls.RegulatoryOracle);
    console.log("TransactionMonitor:   ", deploymentInfo.explorerUrls.TransactionMonitor);
    console.log("InstitutionalTreasury:", deploymentInfo.explorerUrls.InstitutionalTreasury);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Verification failed:", error);
        process.exit(1);
    });
