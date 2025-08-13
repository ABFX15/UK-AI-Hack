// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TransactionMonitor
 * @dev Real-time DeFi transaction monitoring for regulatory compliance
 * @notice Monitors all DeFi transactions for suspicious activity and compliance violations
 */
contract TransactionMonitor is Ownable {
    uint256 private _alertIdCounter;

    constructor(address initialOwner) Ownable(initialOwner) {
        _alertIdCounter = 0;
    }

    enum AlertType {
        LARGE_TRANSACTION,
        SUSPICIOUS_PATTERN,
        BLACKLISTED_ADDRESS,
        GEOGRAPHIC_VIOLATION,
        KYC_REQUIRED
    }

    enum AlertSeverity {
        INFO,
        WARNING,
        CRITICAL,
        EMERGENCY
    }

    struct TransactionAlert {
        uint256 alertId;
        address fromAddress;
        address toAddress;
        uint256 amount;
        address protocol;
        AlertType alertType;
        AlertSeverity severity;
        uint256 timestamp;
        bool investigated;
        string notes;
    }

    // Core storage mappings for comprehensive transaction monitoring
    mapping(uint256 => TransactionAlert) public alerts;
    mapping(address => bool) public blacklistedAddresses;
    mapping(address => bool) public whitelistedProtocols;
    mapping(address => uint256) public dailyTransactionVolume;
    mapping(address => uint256) public riskScores;
    mapping(address => uint256) public lastResetTime; // For daily volume tracking
    mapping(address => uint256) public totalTransactionCount; // Lifetime transaction count
    mapping(address => mapping(address => uint256)) public pairTransactionCount; // from => to => count

    // Events
    event TransactionFlagged(
        uint256 indexed alertId,
        address indexed fromAddress,
        AlertType alertType
    );
    event AddressBlacklisted(address indexed account, string reason);
    event ProtocolWhitelisted(address indexed protocol, string name);

    /**
     * @dev Monitor transaction in real-time
     */
    function monitorTransaction(
        address from,
        address to,
        uint256 amount,
        address protocol,
        bytes calldata /*data*/
    ) external returns (bool shouldFlag, AlertType alertType) {
        // Checks
        require(from != address(0) && to != address(0), "Invalid addresses");
        require(amount > 0, "Amount must be greater than zero");

        // Check for large transactions
        if (amount > 100000 * 10 ** 6) {
            // $100,000 USDC
            _createAlert(
                from,
                to,
                amount,
                protocol,
                AlertType.LARGE_TRANSACTION,
                AlertSeverity.WARNING
            );
            return (true, AlertType.LARGE_TRANSACTION);
        }

        // Check blacklisted addresses
        if (blacklistedAddresses[from] || blacklistedAddresses[to]) {
            _createAlert(
                from,
                to,
                amount,
                protocol,
                AlertType.BLACKLISTED_ADDRESS,
                AlertSeverity.CRITICAL
            );
            return (true, AlertType.BLACKLISTED_ADDRESS);
        }

        // Check protocol whitelist
        if (!whitelistedProtocols[protocol]) {
            _createAlert(
                from,
                to,
                amount,
                protocol,
                AlertType.SUSPICIOUS_PATTERN,
                AlertSeverity.WARNING
            );
            return (true, AlertType.SUSPICIOUS_PATTERN);
        }

        // Check daily volume limits
        uint256 dailyVolume = dailyTransactionVolume[from] + amount;
        if (dailyVolume > 1000000 * 10 ** 6) {
            // $1M daily limit
            _createAlert(
                from,
                to,
                amount,
                protocol,
                AlertType.SUSPICIOUS_PATTERN,
                AlertSeverity.CRITICAL
            );
            return (true, AlertType.SUSPICIOUS_PATTERN);
        }

        // Check for suspicious patterns (frequent transactions between same addresses)
        pairTransactionCount[from][to]++;
        if (pairTransactionCount[from][to] > 10) {
            // More than 10 transactions in session
            _createAlert(
                from,
                to,
                amount,
                protocol,
                AlertType.SUSPICIOUS_PATTERN,
                AlertSeverity.WARNING
            );
        }

        // Effects - Update tracking data
        dailyTransactionVolume[from] = dailyVolume;
        totalTransactionCount[from]++;
        totalTransactionCount[to]++;

        return (false, AlertType.LARGE_TRANSACTION);
    }

    /**
     * @dev Create alert for suspicious transaction
     */
    function createAlert(
        address fromAddress,
        address toAddress,
        uint256 amount,
        address protocol,
        AlertType alertType,
        AlertSeverity severity
    ) external onlyOwner returns (uint256) {
        return
            _createAlert(
                fromAddress,
                toAddress,
                amount,
                protocol,
                alertType,
                severity
            );
    }

    /**
     * @dev Internal function to create alert following CEI pattern
     */
    function _createAlert(
        address fromAddress,
        address toAddress,
        uint256 amount,
        address protocol,
        AlertType alertType,
        AlertSeverity severity
    ) internal returns (uint256) {
        // Checks
        require(fromAddress != address(0), "Invalid from address");
        require(toAddress != address(0), "Invalid to address");
        require(amount > 0, "Amount must be greater than zero");

        // Effects
        _alertIdCounter++;
        uint256 newAlertId = _alertIdCounter;

        alerts[newAlertId] = TransactionAlert({
            alertId: newAlertId,
            fromAddress: fromAddress,
            toAddress: toAddress,
            amount: amount,
            protocol: protocol,
            alertType: alertType,
            severity: severity,
            timestamp: block.timestamp,
            investigated: false,
            notes: ""
        });

        // Interactions (Events)
        emit TransactionFlagged(newAlertId, fromAddress, alertType);

        return newAlertId;
    }

    /**
     * @dev Update risk score for address
     */
    function updateRiskScore(
        address account,
        uint256 newScore
    ) external onlyOwner {
        // Checks
        require(account != address(0), "Invalid account");
        require(newScore <= 100, "Risk score cannot exceed 100");

        // Effects
        riskScores[account] = newScore;

        // If high risk, consider flagging
        if (newScore >= 80) {
            _createAlert(
                account,
                address(0),
                0,
                address(0),
                AlertType.SUSPICIOUS_PATTERN,
                AlertSeverity.WARNING
            );
        }
    }

    /**
     * @dev Blacklist suspicious address
     */
    function blacklistAddress(
        address account,
        string memory reason
    ) external onlyOwner {
        // Checks
        require(account != address(0), "Invalid account");
        require(bytes(reason).length > 0, "Reason cannot be empty");

        // Effects
        blacklistedAddresses[account] = true;
        riskScores[account] = 100; // Maximum risk

        // Interactions (Events)
        emit AddressBlacklisted(account, reason);
    }

    /**
     * @dev Whitelist protocol for monitoring
     */
    function whitelistProtocol(
        address protocol,
        string memory name
    ) external onlyOwner {
        // Checks
        require(protocol != address(0), "Invalid protocol");
        require(bytes(name).length > 0, "Name cannot be empty");

        // Effects
        whitelistedProtocols[protocol] = true;

        // Interactions (Events)
        emit ProtocolWhitelisted(protocol, name);
    }

    /**
     * @dev Get transaction analysis
     */
    function analyzeTransaction(
        address from,
        address to,
        uint256 amount,
        address protocol
    )
        external
        view
        returns (
            uint256 riskScore,
            bool requiresKYC,
            bool isCompliant,
            string memory analysis
        )
    {
        // Check risk factors
        uint256 fromRisk = riskScores[from];
        uint256 toRisk = riskScores[to];
        uint256 protocolRisk = whitelistedProtocols[protocol] ? 10 : 50;
        uint256 amountRisk = amount > 100000 * 10 ** 6 ? 30 : 10; // High amount risk

        // Calculate composite risk score
        uint256 compositeRisk = (fromRisk +
            toRisk +
            protocolRisk +
            amountRisk) / 4;

        // Determine compliance
        bool compliant = !blacklistedAddresses[from] &&
            !blacklistedAddresses[to] &&
            compositeRisk < 70;

        // KYC requirement
        bool kyc = compositeRisk > 50 || amount > 50000 * 10 ** 6;

        string memory analysisResult;
        if (compositeRisk < 30) {
            analysisResult = "Low risk transaction";
        } else if (compositeRisk < 70) {
            analysisResult = "Medium risk - monitor closely";
        } else {
            analysisResult = "High risk - requires investigation";
        }

        return (compositeRisk, kyc, compliant, analysisResult);
    }

    /**
     * @dev Mark alert as investigated
     */
    function markAlertInvestigated(
        uint256 alertId,
        string memory notes
    ) external onlyOwner {
        // Checks
        require(alerts[alertId].alertId != 0, "Alert does not exist");
        require(!alerts[alertId].investigated, "Alert already investigated");

        // Effects
        alerts[alertId].investigated = true;
        alerts[alertId].notes = notes;
    }

    /**
     * @dev Get alerts for address
     */
    function getAlertsForAddress(
        address account
    ) external view returns (uint256[] memory alertIds) {
        // Simple implementation - in production would use more efficient storage
        uint256[] memory tempAlerts = new uint256[](_alertIdCounter);
        uint256 count = 0;

        for (uint256 i = 1; i <= _alertIdCounter; i++) {
            if (
                alerts[i].fromAddress == account ||
                alerts[i].toAddress == account
            ) {
                tempAlerts[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        alertIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            alertIds[i] = tempAlerts[i];
        }

        return alertIds;
    }
}
