// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Interface for compliance oracle
interface IRegulatoryOracle {
    function checkTransactionCompliance(
        address from,
        address to,
        uint256 amount,
        bytes calldata data
    ) external view returns (bool);
}

/**
 * @title InstitutionalTreasury
 * @dev Enterprise-grade DeFi treasury management with compliance controls
 * @notice Banks use this to manage DeFi investments with built-in compliance
 */
contract InstitutionalTreasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 private _investmentIdCounter;
    uint256 private _proposalIdCounter;

    // Additional storage for treasury operations
    mapping(address => uint256) public tokenBalances;
    mapping(address => bool) public whitelistedTokens;
    mapping(address => uint256) public withdrawalLimits;
    mapping(address => bool) public whitelistedProtocols;
    mapping(address => mapping(address => uint256)) public protocolInvestments;
    mapping(address => Investor) public investors;

    IRegulatoryOracle public complianceOracle;
    uint256 public totalInvested;

    struct Investor {
        bool authorized;
        bool isActive;
        uint256 kycLevel;
        string jurisdiction;
        uint256 totalInvested;
        uint256 totalWithdrawn;
        uint256 lastActivity;
    }

    constructor(address initialOwner) Ownable(initialOwner) {
        _investmentIdCounter = 0;
        _proposalIdCounter = 0;
    }

    enum InvestmentType {
        YIELD_FARMING,
        LIQUIDITY_PROVISION,
        LENDING,
        STAKING,
        STRUCTURED_PRODUCT
    }

    enum ProposalStatus {
        PENDING,
        APPROVED,
        REJECTED,
        EXECUTED,
        CLOSED
    }

    enum RiskTier {
        CONSERVATIVE,
        MODERATE,
        AGGRESSIVE,
        SPECULATIVE
    }

    struct Investment {
        uint256 investmentId;
        InvestmentType investmentType;
        address protocol;
        uint256 amount;
        RiskTier riskTier;
        uint256 expectedYield;
        uint256 actualYield;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool complianceApproved;
    }

    struct InvestmentProposal {
        uint256 proposalId;
        InvestmentType investmentType;
        address protocol;
        uint256 amount;
        RiskTier riskTier;
        uint256 expectedYield;
        address proposer;
        ProposalStatus status;
        uint256 createdAt;
        string riskAssessment;
        bool requiresBoard;
    }

    // Core storage mappings for comprehensive treasury management
    mapping(uint256 => Investment) public investments;
    mapping(uint256 => InvestmentProposal) public proposals;
    mapping(address => bool) public approvedProtocols;
    mapping(address => uint256) public protocolAllocations;
    mapping(RiskTier => uint256) public riskLimits;
    mapping(address => bool) public authorizedManagers;

    // Additional tracking for enhanced treasury operations
    mapping(address => string) public protocolNames; // protocol => name
    mapping(address => uint256) public protocolRiskScores; // protocol => risk score (0-100)
    mapping(uint256 => uint256) public investmentToProposal; // investment => proposal mapping
    mapping(address => uint256[]) public managerProposals; // manager => proposal IDs

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        InvestmentType investmentType,
        uint256 amount
    );
    event InvestmentExecuted(
        uint256 indexed investmentId,
        address protocol,
        uint256 amount
    );
    event ProtocolApproved(address indexed protocol, string name);
    event RiskLimitUpdated(RiskTier tier, uint256 newLimit);
    event FundsDeposited(
        address indexed investor,
        address indexed token,
        uint256 amount
    );
    event FundsWithdrawn(
        address indexed investor,
        address indexed token,
        uint256 amount
    );
    event InvestmentMade(
        address indexed protocol,
        address indexed token,
        uint256 amount
    );
    event InvestmentWithdrawn(
        address indexed protocol,
        address indexed token,
        uint256 amount
    );
    event InvestorAuthorized(
        address indexed investor,
        uint256 kycLevel,
        string jurisdiction
    );
    event InvestorRevoked(address indexed investor, string reason);
    event TokenWhitelisted(address indexed token, uint256 withdrawalLimit);
    event ProtocolWhitelisted(address indexed protocol, string name);
    event ComplianceOracleUpdated(address indexed newOracle);
    event EmergencyWithdrawal(
        address indexed token,
        address indexed to,
        uint256 amount
    );

    /**
     * @dev Deposit funds into treasury
     */
    function deposit(address token, uint256 amount) external {
        // Checks
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than zero");
        require(whitelistedTokens[token], "Token not whitelisted");

        // Check investor authorization
        require(investors[msg.sender].authorized, "Investor not authorized");
        require(investors[msg.sender].isActive, "Investor account inactive");

        // Check compliance
        require(
            checkCompliance(msg.sender, token, amount, "DEPOSIT"),
            "Compliance check failed"
        );

        // Effects - Update balances first
        tokenBalances[token] += amount;
        investors[msg.sender].totalInvested += amount;
        investors[msg.sender].lastActivity = block.timestamp;

        // Interactions - Transfer tokens
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Events
        emit FundsDeposited(msg.sender, token, amount);
    }

    /**
     * @dev Withdraw funds from treasury
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        // Checks
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than zero");
        require(whitelistedTokens[token], "Token not whitelisted");
        require(tokenBalances[token] >= amount, "Insufficient balance");

        // Check investor authorization
        require(investors[msg.sender].authorized, "Investor not authorized");
        require(investors[msg.sender].isActive, "Investor account inactive");

        // Check compliance
        require(
            checkCompliance(msg.sender, token, amount, "WITHDRAW"),
            "Compliance check failed"
        );

        // Check withdrawal limits
        require(amount <= withdrawalLimits[token], "Exceeds withdrawal limit");

        // Effects - Update balances
        tokenBalances[token] -= amount;
        investors[msg.sender].totalWithdrawn += amount;
        investors[msg.sender].lastActivity = block.timestamp;

        // Interactions - Transfer tokens
        IERC20(token).safeTransfer(msg.sender, amount);

        // Events
        emit FundsWithdrawn(msg.sender, token, amount);
    }

    /**
     * @dev Invest funds in DeFi protocol
     */
    function investInProtocol(
        address protocol,
        address token,
        uint256 amount,
        bytes calldata data
    ) external onlyOwner nonReentrant {
        // Checks
        require(protocol != address(0), "Invalid protocol address");
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than zero");
        require(whitelistedProtocols[protocol], "Protocol not whitelisted");
        require(whitelistedTokens[token], "Token not whitelisted");
        require(tokenBalances[token] >= amount, "Insufficient balance");

        // Check compliance
        require(
            checkCompliance(address(this), token, amount, "INVEST"),
            "Compliance check failed"
        );

        // Effects - Record investment
        protocolInvestments[protocol][token] += amount;
        tokenBalances[token] -= amount;
        totalInvested += amount;

        // Interactions - Execute investment
        IERC20(token).safeTransfer(protocol, amount);

        // Call protocol if data provided
        if (data.length > 0) {
            (bool success, ) = protocol.call(data);
            require(success, "Protocol call failed");
        }

        // Events
        emit InvestmentMade(protocol, token, amount);
    }

    /**
     * @dev Withdraw from DeFi protocol
     */
    function withdrawFromProtocol(
        address protocol,
        address token,
        uint256 amount,
        bytes calldata data
    ) external onlyOwner nonReentrant {
        // Checks
        require(protocol != address(0), "Invalid protocol address");
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than zero");
        require(whitelistedProtocols[protocol], "Protocol not whitelisted");
        require(
            protocolInvestments[protocol][token] >= amount,
            "Insufficient investment"
        );

        // Effects - Record withdrawal from protocol
        protocolInvestments[protocol][token] -= amount;

        // Interactions - Execute withdrawal from protocol
        if (data.length > 0) {
            // aderyn-fp-next-line(reentrancy-state-change) - Balance update after protocol withdrawal is expected
            (bool success, ) = protocol.call(data);
            require(success, "Protocol withdrawal failed");
        }

        // Update balance after receiving funds
        tokenBalances[token] += amount;

        // Events
        emit InvestmentWithdrawn(protocol, token, amount);
    }

    /**
     * @dev Create investment proposal
     */
    function createProposal(
        InvestmentType investmentType,
        address protocol,
        uint256 amount,
        RiskTier riskTier,
        uint256 expectedYield,
        string memory riskAssessment
    ) external returns (uint256) {
        // Checks
        require(
            authorizedManagers[msg.sender] || msg.sender == owner(),
            "Not authorized to create proposals"
        );
        require(protocol != address(0), "Invalid protocol address");
        require(amount > 0, "Amount must be greater than zero");
        require(approvedProtocols[protocol], "Protocol not approved");
        require(bytes(riskAssessment).length > 0, "Risk assessment required");
        require(amount <= riskLimits[riskTier], "Amount exceeds risk limit");

        // Effects
        _proposalIdCounter++;
        uint256 newProposalId = _proposalIdCounter;

        proposals[newProposalId] = InvestmentProposal({
            proposalId: newProposalId,
            investmentType: investmentType,
            protocol: protocol,
            amount: amount,
            riskTier: riskTier,
            expectedYield: expectedYield,
            proposer: msg.sender,
            status: ProposalStatus.PENDING,
            createdAt: block.timestamp,
            riskAssessment: riskAssessment,
            requiresBoard: amount > 1000000 * 10 ** 6 ||
                riskTier >= RiskTier.AGGRESSIVE // $1M threshold
        });

        // Track proposal by manager
        managerProposals[msg.sender].push(newProposalId);

        // Events
        emit ProposalCreated(newProposalId, investmentType, amount);

        return newProposalId;
    }

    /**
     * @dev Approve investment proposal
     */
    function approveProposal(uint256 proposalId) external onlyOwner {
        // Checks
        require(
            proposals[proposalId].proposalId != 0,
            "Proposal does not exist"
        );
        require(
            proposals[proposalId].status == ProposalStatus.PENDING,
            "Proposal not pending"
        );

        // Check compliance first (before state changes)
        bytes memory proposalData = abi.encode(
            proposals[proposalId].protocol,
            proposals[proposalId].amount,
            proposals[proposalId].investmentType
        );

        bool compliant = true;
        if (address(complianceOracle) != address(0)) {
            // aderyn-fp-next-line(reentrancy-state-change) - View function call, no reentrancy risk
            compliant = complianceOracle.checkTransactionCompliance(
                address(this),
                proposals[proposalId].protocol,
                proposals[proposalId].amount,
                proposalData
            );
        }

        // Effects - Update state based on compliance result
        if (compliant) {
            proposals[proposalId].status = ProposalStatus.APPROVED;
        } else {
            proposals[proposalId].status = ProposalStatus.REJECTED;
            revert("Compliance check failed");
        }
    }

    /**
     * @dev Execute approved investment
     */
    function executeInvestment(
        uint256 proposalId
    ) external onlyOwner nonReentrant returns (uint256) {
        // Checks
        require(
            proposals[proposalId].proposalId != 0,
            "Proposal does not exist"
        );
        require(
            proposals[proposalId].status == ProposalStatus.APPROVED,
            "Proposal not approved"
        );

        InvestmentProposal memory proposal = proposals[proposalId];

        // Effects - Create investment record
        _investmentIdCounter++;
        uint256 newInvestmentId = _investmentIdCounter;

        investments[newInvestmentId] = Investment({
            investmentId: newInvestmentId,
            investmentType: proposal.investmentType,
            protocol: proposal.protocol,
            amount: proposal.amount,
            riskTier: proposal.riskTier,
            expectedYield: proposal.expectedYield,
            actualYield: 0,
            startTime: block.timestamp,
            endTime: 0,
            isActive: true,
            complianceApproved: true
        });

        // Update proposal status and tracking
        proposals[proposalId].status = ProposalStatus.EXECUTED;
        protocolAllocations[proposal.protocol] += proposal.amount;
        totalInvested += proposal.amount;
        investmentToProposal[newInvestmentId] = proposalId;

        // Events
        emit InvestmentExecuted(
            newInvestmentId,
            proposal.protocol,
            proposal.amount
        );

        return newInvestmentId;
    }

    /**
     * @dev Calculate portfolio risk
     */
    function calculatePortfolioRisk()
        external
        view
        returns (uint256 totalRisk, uint256[] memory riskBreakdown)
    {
        uint256[] memory breakdown = new uint256[](4);
        uint256 totalValue = totalInvested;

        if (totalValue == 0) {
            return (0, breakdown);
        }

        uint256 weightedRisk = 0;

        // Calculate risk for each active investment
        for (uint256 i = 1; i <= _investmentIdCounter; i++) {
            if (investments[i].isActive) {
                uint256 weight = (investments[i].amount * 100) / totalValue;
                uint256 riskScore;

                // Assign risk scores based on tier
                if (investments[i].riskTier == RiskTier.CONSERVATIVE) {
                    riskScore = 20;
                    breakdown[0] += weight;
                } else if (investments[i].riskTier == RiskTier.MODERATE) {
                    riskScore = 40;
                    breakdown[1] += weight;
                } else if (investments[i].riskTier == RiskTier.AGGRESSIVE) {
                    riskScore = 70;
                    breakdown[2] += weight;
                } else {
                    riskScore = 90;
                    breakdown[3] += weight;
                }

                weightedRisk += (riskScore * weight) / 100;
            }
        }

        return (weightedRisk, breakdown);
    }

    /**
     * @dev Generate yield report
     */
    function generateYieldReport(
        uint256 startTimestamp,
        uint256 endTimestamp
    )
        external
        view
        returns (
            uint256 totalYield,
            uint256 realizedGains,
            uint256 unrealizedGains,
            uint256 fees
        )
    {
        require(endTimestamp > startTimestamp, "Invalid timestamp range");

        uint256 totalYieldAccumulated = 0;
        uint256 realizedTotal = 0;
        uint256 unrealizedTotal = 0;

        // Calculate yield from all investments in the time period
        for (uint256 i = 1; i <= _investmentIdCounter; i++) {
            Investment memory inv = investments[i];

            if (
                inv.startTime >= startTimestamp &&
                (inv.endTime <= endTimestamp ||
                    (inv.endTime == 0 && inv.isActive))
            ) {
                totalYieldAccumulated += inv.actualYield;

                if (inv.isActive) {
                    unrealizedTotal += inv.actualYield;
                } else {
                    realizedTotal += inv.actualYield;
                }
            }
        }

        // Simplified fee calculation (2% management fee annually)
        uint256 timePeriod = endTimestamp - startTimestamp;
        uint256 managementFees = (totalInvested * 2 * timePeriod) /
            (100 * 365 days);

        return (
            totalYieldAccumulated,
            realizedTotal,
            unrealizedTotal,
            managementFees
        );
    }

    /**
     * @dev Emergency withdrawal from investment
     */
    function emergencyWithdraw(
        uint256 investmentId,
        string memory reason
    ) external onlyOwner {
        // Checks
        require(
            investments[investmentId].investmentId != 0,
            "Investment does not exist"
        );
        require(investments[investmentId].isActive, "Investment not active");
        require(bytes(reason).length > 0, "Reason required");

        // Effects
        investments[investmentId].isActive = false;
        investments[investmentId].endTime = block.timestamp;

        uint256 amount = investments[investmentId].amount;
        address protocol = investments[investmentId].protocol;

        protocolAllocations[protocol] -= amount;

        // Note: Actual withdrawal from protocol would require protocol-specific calls
        // This is a simplified implementation
    }

    /**
     * @dev Set risk limits for different tiers
     */
    function setRiskLimit(RiskTier tier, uint256 limit) external onlyOwner {
        // Checks
        require(limit > 0, "Limit must be positive");

        // Effects
        riskLimits[tier] = limit;

        // Events
        emit RiskLimitUpdated(tier, limit);
    }

    /**
     * @dev Approve protocol for investments
     */
    function approveProtocol(
        address protocol,
        string memory name
    ) external onlyOwner {
        // Checks
        require(protocol != address(0), "Invalid protocol address");
        require(bytes(name).length > 0, "Name cannot be empty");

        // Effects
        approvedProtocols[protocol] = true;
        protocolNames[protocol] = name;
        protocolRiskScores[protocol] = 50; // Default medium risk

        // Events
        emit ProtocolApproved(protocol, name);
    }

    /**
     * @dev Set protocol risk score
     */
    function setProtocolRiskScore(
        address protocol,
        uint256 riskScore
    ) external onlyOwner {
        require(protocol != address(0), "Invalid protocol address");
        require(approvedProtocols[protocol], "Protocol not approved");
        require(riskScore <= 100, "Risk score cannot exceed 100");

        protocolRiskScores[protocol] = riskScore;
    }

    /**
     * @dev Authorize investor
     */
    function authorizeInvestor(
        address investor,
        uint256 kycLevel,
        string memory jurisdiction
    ) external onlyOwner {
        // Checks
        require(investor != address(0), "Invalid investor address");
        require(kycLevel > 0 && kycLevel <= 3, "Invalid KYC level");
        require(bytes(jurisdiction).length > 0, "Jurisdiction cannot be empty");

        // Effects
        investors[investor] = Investor({
            authorized: true,
            isActive: true,
            kycLevel: kycLevel,
            jurisdiction: jurisdiction,
            totalInvested: 0,
            totalWithdrawn: 0,
            lastActivity: block.timestamp
        });

        // Events
        emit InvestorAuthorized(investor, kycLevel, jurisdiction);
    }

    /**
     * @dev Revoke investor authorization
     */
    function revokeInvestor(
        address investor,
        string memory reason
    ) external onlyOwner {
        // Checks
        require(investor != address(0), "Invalid investor address");
        require(investors[investor].authorized, "Investor not authorized");
        require(bytes(reason).length > 0, "Reason cannot be empty");

        // Effects
        investors[investor].authorized = false;
        investors[investor].isActive = false;

        // Events
        emit InvestorRevoked(investor, reason);
    }

    /**
     * @dev Whitelist token for treasury operations
     */
    function whitelistToken(
        address token,
        uint256 withdrawalLimit
    ) external onlyOwner {
        // Checks
        require(token != address(0), "Invalid token address");
        require(withdrawalLimit > 0, "Withdrawal limit must be positive");

        // Effects
        whitelistedTokens[token] = true;
        withdrawalLimits[token] = withdrawalLimit;

        // Events
        emit TokenWhitelisted(token, withdrawalLimit);
    }

    /**
     * @dev Whitelist DeFi protocol
     */
    function whitelistProtocol(
        address protocol,
        string memory name
    ) external onlyOwner {
        // Checks
        require(protocol != address(0), "Invalid protocol address");
        require(bytes(name).length > 0, "Name cannot be empty");

        // Effects
        whitelistedProtocols[protocol] = true;

        // Events
        emit ProtocolWhitelisted(protocol, name);
    }

    /**
     * @dev Authorize manager to create proposals
     */
    function authorizeManager(address manager) external onlyOwner {
        require(manager != address(0), "Invalid manager address");
        authorizedManagers[manager] = true;
    }

    /**
     * @dev Revoke manager authorization
     */
    function revokeManager(address manager) external onlyOwner {
        authorizedManagers[manager] = false;
    }

    /**
     * @dev Set compliance oracle
     */
    function setComplianceOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle address");
        complianceOracle = IRegulatoryOracle(newOracle);
        emit ComplianceOracleUpdated(newOracle);
    }

    /**
     * @dev Check compliance for operation
     */
    function checkCompliance(
        address investor,
        address token,
        uint256 amount,
        string memory operation
    ) public view returns (bool) {
        if (address(complianceOracle) == address(0)) {
            return true; // Default to true if no oracle set
        }

        // Create transaction data for compliance check
        bytes memory txData = abi.encode(
            investor,
            token,
            amount,
            operation,
            block.timestamp
        );

        return
            complianceOracle.checkTransactionCompliance(
                investor,
                address(this),
                amount,
                txData
            );
    }

    /**
     * @dev Get investment details
     */
    function getInvestment(
        uint256 investmentId
    ) external view returns (Investment memory) {
        return investments[investmentId];
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(
        uint256 proposalId
    ) external view returns (InvestmentProposal memory) {
        return proposals[proposalId];
    }

    /**
     * @dev Get investor information
     */
    function getInvestorInfo(
        address investor
    )
        external
        view
        returns (
            bool authorized,
            bool isActive,
            uint256 kycLevel,
            string memory jurisdiction,
            uint256 investorTotalInvested,
            uint256 totalWithdrawn
        )
    {
        Investor memory inv = investors[investor];
        return (
            inv.authorized,
            inv.isActive,
            inv.kycLevel,
            inv.jurisdiction,
            inv.totalInvested,
            inv.totalWithdrawn
        );
    }

    /**
     * @dev Get token balance
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return tokenBalances[token];
    }

    /**
     * @dev Get protocol investment amount
     */
    function getProtocolInvestment(
        address protocol,
        address token
    ) external view returns (uint256) {
        return protocolInvestments[protocol][token];
    }

    /**
     * @dev Get proposals created by manager
     */
    function getManagerProposals(
        address manager
    ) external view returns (uint256[] memory) {
        return managerProposals[manager];
    }

    /**
     * @dev Get treasury statistics
     */
    function getTreasuryStats()
        external
        view
        returns (
            uint256 totalValue,
            uint256 totalInvestedAmount,
            uint256 numberOfInvestors
        )
    {
        // Simple implementation - in production would track more efficiently
        uint256 investorCount = 0;

        // Note: This is a basic implementation
        // In production, you'd maintain these counters more efficiently
        return (totalInvested, totalInvested, investorCount);
    }

    /**
     * @dev Emergency withdrawal of tokens (only owner)
     */
    function emergencyTokenWithdraw(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        // Checks
        require(token != address(0), "Invalid token address");
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");
        require(tokenBalances[token] >= amount, "Insufficient balance");

        // Effects
        tokenBalances[token] -= amount;

        // Interactions
        IERC20(token).safeTransfer(to, amount);

        // Events
        emit EmergencyWithdrawal(token, to, amount);
    }
}
