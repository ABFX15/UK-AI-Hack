const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying Web3 Talent Agent Smart Contracts...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // Deploy TalentReputationScore contract
    console.log("\n📊 Deploying TalentReputationScore...");
    const TalentReputationScore = await ethers.getContractFactory("TalentReputationScore");
    const reputationScore = await TalentReputationScore.deploy(deployer.address);
    await reputationScore.waitForDeployment();
    const reputationAddress = await reputationScore.getAddress();
    console.log("✅ TalentReputationScore deployed to:", reputationAddress);

    // Deploy SLAEnforcement contract
    console.log("\n⚖️ Deploying SLAEnforcement...");
    const SLAEnforcement = await ethers.getContractFactory("SLAEnforcement");
    const slaEnforcement = await SLAEnforcement.deploy(deployer.address);
    await slaEnforcement.waitForDeployment();
    const slaAddress = await slaEnforcement.getAddress();
    console.log("✅ SLAEnforcement deployed to:", slaAddress);

    // Deploy TalentMatching contract
    console.log("\n🎯 Deploying TalentMatching...");
    const TalentMatching = await ethers.getContractFactory("TalentMatching");
    const talentMatching = await TalentMatching.deploy(
        deployer.address,
        reputationAddress,
        slaAddress
    );
    await talentMatching.waitForDeployment();
    const matchingAddress = await talentMatching.getAddress();
    console.log("✅ TalentMatching deployed to:", matchingAddress);

    // Save deployment addresses
    const deploymentInfo = {
        network: hre.network.name,
        deployer: deployer.address,
        contracts: {
            TalentReputationScore: reputationAddress,
            SLAEnforcement: slaAddress,
            TalentMatching: matchingAddress
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
                address: reputationAddress,
                constructorArguments: [deployer.address]
            });
            console.log("✅ TalentReputationScore verified");
        } catch (error) {
            console.log("❌ TalentReputationScore verification failed:", error.message);
        }

        try {
            await hre.run("verify:verify", {
                address: slaAddress,
                constructorArguments: [deployer.address]
            });
            console.log("✅ SLAEnforcement verified");
        } catch (error) {
            console.log("❌ SLAEnforcement verification failed:", error.message);
        }

        try {
            await hre.run("verify:verify", {
                address: matchingAddress,
                constructorArguments: [deployer.address, reputationAddress, slaAddress]
            });
            console.log("✅ TalentMatching verified");
        } catch (error) {
            console.log("❌ TalentMatching verification failed:", error.message);
        }
    }

    console.log("\n📋 Contract Addresses Summary:");
    console.log("TalentReputationScore:", reputationAddress);
    console.log("SLAEnforcement:", slaAddress);
    console.log("TalentMatching:", matchingAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
