const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    console.log("Testing connection to Circle Layer Testnet...");
    console.log("Network:", hre.network.name);
    console.log("Chain ID:", hre.network.config.chainId);
    console.log("RPC URL:", hre.network.config.url);

    try {
        // Test provider connection
        const provider = ethers.provider;
        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name, "Chain ID:", network.chainId.toString());

        // Test getting signers
        console.log("Getting signers...");
        const signers = await ethers.getSigners();
        console.log("Number of signers:", signers.length);

        if (signers.length > 0) {
            const deployer = signers[0];
            console.log("Deployer address:", deployer.address);

            // Test getting balance
            const balance = await provider.getBalance(deployer.address);
            console.log("Deployer balance:", ethers.formatEther(balance), "CLAYER");
        } else {
            console.log("❌ No signers available - check PRIVATE_KEY in .env file");
        }

    } catch (error) {
        console.error("❌ Connection failed:", error.message);
    }
}

main().catch(console.error);
