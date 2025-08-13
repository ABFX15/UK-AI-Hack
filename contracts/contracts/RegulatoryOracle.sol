// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RegulatoryOracle
 * @dev Core regulatory compliance monitoring and enforcement for DeFi
 * @notice Banks use this to ensure all DeFi activities comply with regulations
 */
contract RegulatoryOracle is Ownable, ReentrancyGuard {
    uint256 private _ruleIdCounter;
    uint256 private _violationIdCounter;
    uint256 private _reportIdCounter;

    constructor(address initialOwner) Ownable(initialOwner) {
        _ruleIdCounter = 0;
        _violationIdCounter = 0;
        _reportIdCounter = 0;
    }

    enum ComplianceRegion {
        US_SEC,
        EU_MICA,
        UK_FCA,
        JAPAN_FSA,
        GLOBAL
    }

    enum RiskLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    enum ViolationType {
        KYC_AML,
        TRANSACTION_LIMIT,
        PROTOCOL_BLACKLIST,
        GEOGRAPHIC_RESTRICTION,
        REPORTING_REQUIREMENT
    }

    struct ComplianceRule {
        uint256 ruleId;
        string ruleName;
        ComplianceRegion region;
        RiskLevel riskLevel;
        bool isActive;
        uint256 createdAt;
        uint256 lastUpdated;
        string ruleDescription;
    }

    struct ComplianceViolation {
        uint256 violationId;
        uint256 ruleId;
        address violatingEntity;
        ViolationType violationType;
        RiskLevel severity;
        uint256 timestamp;
        string details;
        bool resolved;
        uint256 penaltyAmount;
    }

    struct ComplianceReport {
        uint256 reportId;
        address institution;
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint256 totalTransactions;
        uint256 flaggedTransactions;
        uint256 violationCount;
        bool submitted;
    }

    // Core mappings
    mapping(uint256 => ComplianceRule) public complianceRules;
    mapping(uint256 => ComplianceViolation) public violations;
    mapping(uint256 => ComplianceReport) public complianceReports;
    mapping(address => bool) public authorizedInstitutions;
    mapping(address => ComplianceRegion[]) public institutionRegions;

    // Additional specialized mappings for enhanced compliance
    mapping(address => mapping(address => bool)) public protocolWhitelist; // institution => protocol => allowed
    mapping(address => uint256) public amlRiskScores; // address => risk score (0-100)
    mapping(string => bool) public restrictedJurisdictions; // jurisdiction => restricted
    mapping(address => uint256) public lastTransactionTime; // address => timestamp for monitoring

    // Events
    event ComplianceRuleCreated(
        uint256 indexed ruleId,
        ComplianceRegion region,
        RiskLevel riskLevel
    );
    event ViolationDetected(
        uint256 indexed violationId,
        address indexed entity,
        ViolationType violationType
    );
    event ComplianceReportGenerated(
        uint256 indexed reportId,
        address indexed institution
    );
    event InstitutionAuthorized(
        address indexed institution,
        ComplianceRegion[] regions
    );
    event EmergencyFreezeActivated(address indexed institution, string reason);
    event AMLRiskScoreUpdated(address indexed account, uint256 newScore);
    event JurisdictionRestricted(string jurisdiction, bool restricted);
    event ProtocolWhitelisted(
        address indexed institution,
        address indexed protocol,
        bool whitelisted
    );

    /**
     * @dev Add new compliance rule
     */
    function createComplianceRule(
        string memory ruleName,
        ComplianceRegion region,
        RiskLevel riskLevel,
        string memory ruleDescription
    ) external onlyOwner returns (uint256) {
        // Checks
        require(bytes(ruleName).length > 0, "Rule name cannot be empty");
        require(
            bytes(ruleDescription).length > 0,
            "Rule description cannot be empty"
        );

        // Effects
        _ruleIdCounter++;
        uint256 newRuleId = _ruleIdCounter;

        complianceRules[newRuleId] = ComplianceRule({
            ruleId: newRuleId,
            ruleName: ruleName,
            region: region,
            riskLevel: riskLevel,
            isActive: true,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp,
            ruleDescription: ruleDescription
        });

        // Interactions (Events)
        emit ComplianceRuleCreated(newRuleId, region, riskLevel);

        return newRuleId;
    }

    /**
     * @dev Check if transaction complies with all applicable rules
     */
    function checkTransactionCompliance(
        address from,
        address to,
        uint256 amount,
        address protocol
    ) external view returns (bool compliant, string memory reason) {
        // Checks - Basic validation
        if (from == address(0) || to == address(0)) {
            return (false, "Invalid addresses");
        }

        if (amount == 0) {
            return (false, "Amount must be greater than zero");
        }

        // Check if institution is authorized
        if (!authorizedInstitutions[from]) {
            return (false, "Institution not authorized");
        }

        // Check transaction limits (simplified)
        if (amount > 1000000 * 10 ** 6) {
            // $1M limit in USDC
            return (false, "Transaction exceeds limit");
        }

        // Check protocol whitelist (simplified)
        // In real implementation, would check against approved protocols
        if (protocol == address(0)) {
            return (false, "Invalid protocol");
        }

        return (true, "Transaction compliant");
    }

    /**
     * @dev Report compliance violation
     */
    function reportViolation(
        uint256 ruleId,
        address violatingEntity,
        ViolationType violationType,
        string memory details
    ) external returns (uint256) {
        // Checks
        require(
            complianceRules[ruleId].isActive,
            "Rule does not exist or inactive"
        );
        require(violatingEntity != address(0), "Invalid violating entity");
        require(bytes(details).length > 0, "Details cannot be empty");

        // Effects
        _violationIdCounter++;
        uint256 newViolationId = _violationIdCounter;

        violations[newViolationId] = ComplianceViolation({
            violationId: newViolationId,
            ruleId: ruleId,
            violatingEntity: violatingEntity,
            violationType: violationType,
            severity: complianceRules[ruleId].riskLevel,
            timestamp: block.timestamp,
            details: details,
            resolved: false,
            penaltyAmount: _calculatePenalty(complianceRules[ruleId].riskLevel)
        });

        // Interactions (Events)
        emit ViolationDetected(newViolationId, violatingEntity, violationType);

        return newViolationId;
    }

    /**
     * @dev Generate compliance report for institution
     */
    function generateComplianceReport(
        address institution,
        uint256 startTimestamp,
        uint256 endTimestamp
    ) external returns (uint256) {
        // Checks
        require(
            authorizedInstitutions[institution],
            "Institution not authorized"
        );
        require(startTimestamp < endTimestamp, "Invalid time range");
        require(
            endTimestamp <= block.timestamp,
            "End time cannot be in future"
        );

        // Effects
        _reportIdCounter++;
        uint256 newReportId = _reportIdCounter;

        // Simplified report generation - in real implementation would aggregate data
        complianceReports[newReportId] = ComplianceReport({
            reportId: newReportId,
            institution: institution,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            totalTransactions: _getTransactionCount(
                institution,
                startTimestamp,
                endTimestamp
            ),
            flaggedTransactions: _getFlaggedCount(
                institution,
                startTimestamp,
                endTimestamp
            ),
            violationCount: _getViolationCount(
                institution,
                startTimestamp,
                endTimestamp
            ),
            submitted: false
        });

        // Interactions (Events)
        emit ComplianceReportGenerated(newReportId, institution);

        return newReportId;
    }

    /**
     * @dev Authorize institution for compliance monitoring
     */
    function authorizeInstitution(
        address institution,
        ComplianceRegion[] memory regions
    ) external onlyOwner {
        // Checks
        require(institution != address(0), "Invalid institution address");
        require(regions.length > 0, "Must specify at least one region");

        // Effects
        authorizedInstitutions[institution] = true;
        institutionRegions[institution] = regions;

        // Interactions (Events)
        emit InstitutionAuthorized(institution, regions);
    }

    /**
     * @dev Get compliance score for institution
     */
    function getComplianceScore(
        address institution
    ) external view returns (uint256 score) {
        // Checks
        require(
            authorizedInstitutions[institution],
            "Institution not authorized"
        );

        // Calculate compliance score based on violation history
        uint256 violationCount = _getRecentViolationCount(institution);

        if (violationCount == 0) {
            return 100;
        } else if (violationCount <= 2) {
            return 85;
        } else if (violationCount <= 5) {
            return 70;
        } else {
            return 50;
        }
    }

    /**
     * @dev Emergency compliance freeze
     */
    function emergencyFreeze(
        address entity,
        string memory reason
    ) external onlyOwner {
        // Checks
        require(entity != address(0), "Invalid entity");
        require(bytes(reason).length > 0, "Reason cannot be empty");

        // Effects
        authorizedInstitutions[entity] = false;

        // Create emergency violation record
        _violationIdCounter++;
        violations[_violationIdCounter] = ComplianceViolation({
            violationId: _violationIdCounter,
            ruleId: 0, // Emergency rule
            violatingEntity: entity,
            violationType: ViolationType.REPORTING_REQUIREMENT,
            severity: RiskLevel.CRITICAL,
            timestamp: block.timestamp,
            details: string(
                bytes.concat(bytes("Emergency freeze: "), bytes(reason))
            ),
            resolved: false,
            penaltyAmount: 0
        });

        // Interactions (Events)
        emit ViolationDetected(
            _violationIdCounter,
            entity,
            ViolationType.REPORTING_REQUIREMENT
        );
    }

    // Internal helper functions
    function _calculatePenalty(
        RiskLevel riskLevel
    ) internal pure returns (uint256) {
        if (riskLevel == RiskLevel.LOW) return 1000 * 10 ** 6; // $1,000 USDC
        if (riskLevel == RiskLevel.MEDIUM) return 10000 * 10 ** 6; // $10,000 USDC
        if (riskLevel == RiskLevel.HIGH) return 100000 * 10 ** 6; // $100,000 USDC
        return 1000000 * 10 ** 6; // $1,000,000 USDC for CRITICAL
    }

    function _getTransactionCount(
        address,
        uint256,
        uint256
    ) internal pure returns (uint256) {
        // Simplified - would integrate with transaction monitoring
        return 100;
    }

    function _getFlaggedCount(
        address,
        uint256,
        uint256
    ) internal pure returns (uint256) {
        // Simplified - would check flagged transactions
        return 2;
    }

    function _getViolationCount(
        address,
        uint256,
        uint256
    ) internal pure returns (uint256) {
        // Simplified - would count violations in timeframe
        return 1;
    }

    function _getRecentViolationCount(address) internal pure returns (uint256) {
        // Simplified - would count recent violations
        return 0;
    }

    /**
     * @dev Set AML risk score for address
     */
    function setAMLRiskScore(
        address account,
        uint256 riskScore
    ) external onlyOwner {
        require(account != address(0), "Invalid account");
        require(riskScore <= 100, "Risk score cannot exceed 100");

        amlRiskScores[account] = riskScore;
        emit AMLRiskScoreUpdated(account, riskScore);
    }

    /**
     * @dev Restrict jurisdiction for compliance
     */
    function restrictJurisdiction(
        string memory jurisdiction,
        bool restricted
    ) external onlyOwner {
        require(bytes(jurisdiction).length > 0, "Invalid jurisdiction");

        restrictedJurisdictions[jurisdiction] = restricted;
        emit JurisdictionRestricted(jurisdiction, restricted);
    }

    /**
     * @dev Whitelist protocol for institution
     */
    function whitelistProtocolForInstitution(
        address institution,
        address protocol,
        bool whitelisted
    ) external onlyOwner {
        require(institution != address(0), "Invalid institution");
        require(protocol != address(0), "Invalid protocol");
        require(
            authorizedInstitutions[institution],
            "Institution not authorized"
        );

        protocolWhitelist[institution][protocol] = whitelisted;
        emit ProtocolWhitelisted(institution, protocol, whitelisted);
    }

    /**
     * @dev Get AML risk score for address
     */
    function getAMLRiskScore(address account) external view returns (uint256) {
        return amlRiskScores[account];
    }

    /**
     * @dev Check if jurisdiction is restricted
     */
    function isJurisdictionRestricted(
        string memory jurisdiction
    ) external view returns (bool) {
        return restrictedJurisdictions[jurisdiction];
    }

    /**
     * @dev Check if protocol is whitelisted for institution
     */
    function isProtocolWhitelisted(
        address institution,
        address protocol
    ) external view returns (bool) {
        return protocolWhitelist[institution][protocol];
    }
}
