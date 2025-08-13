require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        hardhat: {
            chainId: 1337
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 1337
        },
        circle: {
            url: "https://api.circle.com/rpc", // Update with actual Circle Layer RPC URL
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 23452, // Update with actual Circle Layer chain ID
            gasPrice: 20000000000,
        },
        circleTestnet: {
            url: "https://testnet-rpc.circlelayer.com",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 28525, // Circle Layer testnet chain ID
            gasPrice: 21000000000, // 0.000021 CLAYER (minimum recommended)
            timeout: 60000
        }
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD"
    },
    etherscan: {
        apiKey: {
            // For Etherscan (if needed for other networks)
            mainnet: process.env.ETHERSCAN_API_KEY || "",
            goerli: process.env.ETHERSCAN_API_KEY || "",
            sepolia: process.env.ETHERSCAN_API_KEY || "",
            // Circle Layer doesn't need API key for verification
            circleTestnet: "not-needed"
        },
        customChains: [
            {
                network: "circleTestnet",
                chainId: 28525,
                urls: {
                    apiURL: "https://explorer-testnet.circlelayer.com/api",
                    browserURL: "https://explorer-testnet.circlelayer.com"
                }
            }
        ]
    }
};