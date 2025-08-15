# Circle Layer Testnet Deployment Guide

## 🔵 Circle Layer Testnet Deployment

This guide walks you through deploying the DeFi Regulatory Compliance Platform to Circle Layer Testnet.

### Prerequisites

1. **Fund your account**: Get testnet tokens from the Circle Layer faucet

   - Visit: https://testnet.circlelayer.com/faucet
   - Request tokens for your deployer address

2. **Set up environment variables**:
   ```bash
   # Add your private key to contracts/.env
   PRIVATE_KEY=your_private_key_here
   ```

### Network Configuration

The Circle Layer Testnet is configured in `hardhat.config.js`:

- **RPC URL**: https://testnet-rpc.circlelayer.com
- **Chain ID**: 28525
- **Gas Price**: 21 gwei (0.000021 CLAYER)
- **Block Explorer**: https://explorer-testnet.circlelayer.com (Circle Layer's own explorer, NOT Etherscan)
- **Explorer API**: https://explorer-testnet.circlelayer.com/api

### Deployment Steps

1. **Install dependencies** (if not already done):

   ```bash
   cd contracts
   npm install
   ```

2. **Compile contracts**:

   ```bash
   npx hardhat compile
   ```

3. **Deploy to Circle Layer Testnet**:

   ```bash
   npx hardhat run scripts/deploy-circle.js --network circleTestnet
   ```

4. **Setup contracts** (run after deployment):

   ```bash
   npx hardhat run scripts/setup-circle.js --network circleTestnet
   ```

5. **Verify contracts** (optional):
   ```bash
   npx hardhat verify --network circleTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
   ```

### What Gets Deployed

1. **RegulatoryOracle**: Compliance rule engine and violation management
2. **TransactionMonitor**: Real-time transaction monitoring and alerting
3. **InstitutionalTreasury**: Enterprise DeFi investment management

### Post-Deployment Configuration

The setup script automatically configures:

- ✅ KYC and AML compliance rules
- ✅ Sample institution authorization
- ✅ Protocol whitelisting
- ✅ Treasury-Oracle integration
- ✅ Risk limits for investment tiers
- ✅ Manager authorization

### Verification

After deployment, you can:

1. View contracts on Circle Layer explorer
2. Interact with contracts through the frontend
3. Test compliance checks and monitoring
4. Create investment proposals

### Troubleshooting

**Common Issues:**

1. **Insufficient Balance**: Fund your account at the faucet
2. **Gas Estimation Failed**: Network congestion, try again
3. **Transaction Reverted**: Check contract state and parameters
4. **Network Connection**: Verify RPC URL and network configuration

### Contract Interaction Examples

```javascript
// Example: Create a compliance rule
await regulatoryOracle.createComplianceRule(
  "CUSTOM_RULE",
  "Custom compliance requirement",
  ethers.parseUnits("50000", 6), // $50,000
  true,
  "CUSTOM"
);

// Example: Monitor a transaction
const [shouldFlag, alertType] = await transactionMonitor.monitorTransaction(
  fromAddress,
  toAddress,
  amount,
  protocolAddress,
  "0x"
);

// Example: Create investment proposal
const proposalId = await institutionalTreasury.createProposal(
  0, // YIELD_FARMING
  protocolAddress,
  ethers.parseUnits("100000", 6), // $100,000
  1, // MODERATE risk
  500, // 5% expected yield
  "Conservative yield farming strategy"
);
```

### Next Steps

1. **Frontend Integration**: Update frontend to use Circle Layer testnet
2. **Backend Configuration**: Configure AI service for testnet
3. **Testing**: Run comprehensive tests on live network
4. **Documentation**: Update API docs with testnet endpoints

### Support

- Circle Layer Docs: https://docs.circlelayer.com
- Testnet Explorer: https://testnet.circlelayer.com
- RPC Endpoint: https://testnet.circlelayer.com
