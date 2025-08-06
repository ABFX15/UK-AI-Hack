# Web3 Talent Agent Smart Contracts

This directory contains the smart contracts for the Web3 Talent Agent platform, designed for deployment on Circle Layer blockchain.

## 🏗️ Contract Architecture

### 1. TalentReputationScore.sol

**Purpose**: Manages immutable reputation scores for candidates and companies

**Key Features**:

- 📊 Multi-dimensional scoring (GitHub, SLA, Technical, Communication, Professionalism)
- 🔒 Tamper-proof on-chain storage
- 📈 Historical score tracking with update reasons
- 🎯 Weighted total score calculation

**Main Functions**:

```solidity
createReputationScore(address user, uint256[5] scores)
updateReputationScore(uint256 scoreId, uint256[5] newScores, string reason)
getUserReputationScore(address user) returns (ReputationScore)
```

### 2. SLAEnforcement.sol

**Purpose**: Anti-ghosting system with automated penalty enforcement

**Key Features**:

- ⚖️ Smart contract-based SLA creation and enforcement
- 🚫 Anti-ghosting penalties with severity levels
- 💰 Automated penalty collection and distribution
- 📊 Violation tracking and reputation impact

**Main Functions**:

```solidity
createSLA(candidate, company, slaType, timeLimit, penalty)
createViolation(slaId, violator, severity, reason)
payPenalty(violationId) payable
```

**SLA Types**:

- `CANDIDATE_RESPONSE`: Response to company communications
- `COMPANY_RESPONSE`: Response to candidate applications
- `INTERVIEW_SCHEDULING`: Scheduling and attendance
- `FEEDBACK_PROVISION`: Providing interview feedback
- `OFFER_RESPONSE`: Response to job offers

### 3. TalentMatching.sol

**Purpose**: Job posting and application management with on-chain matching scores

**Key Features**:

- 💼 Decentralized job posting and application system
- 🎯 AI-powered matching score storage
- 📊 Application lifecycle tracking
- 🔍 Transparent hiring process

**Main Functions**:

```solidity
postJob(title, description, skills[], salary, experience, deadline)
submitApplication(jobId, githubProfile, resumeHash)
calculateAndStoreMatch(jobId, candidate, scores)
```

## 🚀 Quick Setup

### Prerequisites

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env
```

### Deployment

#### Local Testing

```bash
# Start local Hardhat network
npx hardhat node

# Deploy contracts locally
npm run deploy:local
```

#### Circle Layer Deployment

```bash
# Configure your .env with Circle network details
# Deploy to Circle
npm run deploy:circle
```

### Testing

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run coverage
npx hardhat coverage
```

## 🔧 Integration

### Backend Integration

The contracts integrate with your Node.js backend through the `web3Service.ts`:

```typescript
import { web3Service } from "./services/web3/web3Service";

// Create reputation score
await web3Service.createReputationScore(
  userAddress,
  githubScore,
  slaCompliance,
  professionalismScore,
  technicalScore,
  communicationScore
);

// Create SLA
const { slaId } = await web3Service.createSLA(
  candidateAddress,
  companyAddress,
  SLAType.CANDIDATE_RESPONSE,
  24, // 24 hours
  "0.1" // 0.1 ETH penalty
);
```

### Frontend Integration

Dashboard displays real-time blockchain data:

- ✅ Live reputation scores
- ⚖️ SLA compliance monitoring
- 🚨 Violation alerts
- 📊 Matching analytics

## 📊 On-Chain Data Structure

### Reputation Score Storage

```
ReputationScore {
  userAddress: address
  githubScore: uint256      // 0-100
  slaCompliance: uint256    // 0-100
  professionalismScore: uint256 // 0-100
  technicalScore: uint256   // 0-100
  communicationScore: uint256 // 0-100
  totalScore: uint256       // Calculated average
  timestamp: uint256
  isActive: bool
}
```

### SLA Contract Storage

```
SLAContract {
  slaId: uint256
  candidate: address
  company: address
  slaType: enum
  responseTimeHours: uint256
  penaltyAmount: uint256
  deadline: uint256
  isActive: bool
  isCompleted: bool
}
```

## 🎯 Anti-Ghosting System

### How It Works

1. **SLA Creation**: Automatic SLA creation when application is submitted
2. **Deadline Tracking**: Smart contract monitors response deadlines
3. **Violation Detection**: Automated violation creation when deadlines are missed
4. **Penalty Enforcement**: Immediate penalty application with reputation impact
5. **Payment Processing**: On-chain penalty collection and distribution

### Penalty Severity Levels

- **MINOR** (100%): Late response (< 2x deadline)
- **MODERATE** (150%): Very late response (2-3x deadline)
- **SEVERE** (200%): Extremely late (3-5x deadline)
- **CRITICAL** (300%): Complete ghosting (>5x deadline)

## 🔒 Security Features

- ✅ **OpenZeppelin**: Battle-tested security contracts
- ✅ **Access Control**: Owner-based permissions for sensitive operations
- ✅ **Reentrancy Guard**: Protection against reentrancy attacks
- ✅ **Input Validation**: Comprehensive parameter validation
- ✅ **Event Logging**: Full audit trail of all operations

## 📈 Gas Optimization

- **Struct Packing**: Optimized storage layout
- **Event Indexing**: Efficient log filtering
- **Batch Operations**: Multiple updates in single transaction
- **Storage Patterns**: Efficient mapping structures

## 🌐 Circle Layer Benefits

- **Low Fees**: Minimal transaction costs for frequent operations
- **Fast Finality**: Quick confirmation for real-time experience
- **EVM Compatibility**: Standard Ethereum tooling and libraries
- **Institutional Grade**: Enterprise-ready blockchain infrastructure

## 📋 Environment Variables

```bash
# Required for deployment
PRIVATE_KEY=your_deployer_private_key
CIRCLE_RPC_URL=https://rpc.circle.network
ETHERSCAN_API_KEY=your_api_key

# Optional
REPORT_GAS=true
CIRCLE_CHAIN_ID=8453
```

## 🧪 Testing Coverage

- ✅ Reputation score creation and updates
- ✅ SLA lifecycle management
- ✅ Violation creation and penalty payment
- ✅ Job posting and application flow
- ✅ Access control and permissions
- ✅ Gas usage optimization
- ✅ Edge cases and error handling

## 🚨 Important Notes

1. **Private Keys**: Never commit private keys to version control
2. **Contract Verification**: Always verify contracts on block explorers
3. **Upgrades**: Contracts are non-upgradeable for security - plan deployments carefully
4. **Testing**: Thoroughly test on testnet before mainnet deployment
5. **Gas Costs**: Monitor gas usage in production for cost optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

---

**🌟 Ready for Hackathon Demo!**

These contracts provide a solid foundation for your Web3 talent platform with:

- Immutable reputation tracking
- Anti-ghosting enforcement
- Transparent matching process
- Circle Layer optimization

Deploy to testnet, integrate with your frontend, and showcase the power of Web3 in recruitment! 🚀
