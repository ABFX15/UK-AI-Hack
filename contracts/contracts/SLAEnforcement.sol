// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SLAEnforcement
 * @dev Manages Service Level Agreements and anti-ghosting enforcement
 */
contract SLAEnforcement is Ownable, ReentrancyGuard {
    uint256 private _slaIdCounter;
    uint256 private _violationIdCounter;

    constructor(address initialOwner) Ownable(initialOwner) {
        _slaIdCounter = 0;
        _violationIdCounter = 0;
    }

    enum SLAType {
        CANDIDATE_RESPONSE,
        COMPANY_RESPONSE,
        INTERVIEW_SCHEDULING,
        FEEDBACK_PROVISION,
        OFFER_RESPONSE
    }

    enum ViolationSeverity {
        MINOR,
        MODERATE,
        SEVERE,
        CRITICAL
    }

    struct SLAContract {
        uint256 slaId;
        address candidate;
        address company;
        SLAType slaType;
        uint256 responseTimeHours;
        uint256 penaltyAmount;
        uint256 createdAt;
        uint256 deadline;
        bool isActive;
        bool isCompleted;
    }

    struct SLAViolation {
        uint256 violationId;
        uint256 slaId;
        address violator;
        ViolationSeverity severity;
        uint256 penaltyApplied;
        uint256 violationTime;
        string reason;
        bool penaltyPaid;
    }

    // Mappings
    mapping(uint256 => SLAContract) public slaContracts;
    mapping(uint256 => SLAViolation) public violations;
    mapping(address => uint256[]) public userSLAs;
    mapping(address => uint256[]) public userViolations;
    mapping(address => uint256) public userPenaltyBalance;
    mapping(address => uint256) public userViolationCount;

    // Events
    event SLACreated(
        uint256 indexed slaId,
        address indexed candidate,
        address indexed company,
        SLAType slaType,
        uint256 deadline
    );

    event SLACompleted(
        uint256 indexed slaId,
        address completedBy,
        uint256 completionTime
    );

    event SLAViolated(
        uint256 indexed violationId,
        uint256 indexed slaId,
        address indexed violator,
        ViolationSeverity severity,
        uint256 penalty
    );

    event PenaltyPaid(
        uint256 indexed violationId,
        address indexed violator,
        uint256 amount
    );

    // Modifiers
    modifier onlyParticipant(uint256 slaId) {
        SLAContract memory sla = slaContracts[slaId];
        require(
            msg.sender == sla.candidate ||
                msg.sender == sla.company ||
                msg.sender == owner(),
            "Not authorized for this SLA"
        );
        _;
    }

    modifier slaExists(uint256 slaId) {
        require(slaContracts[slaId].isActive, "SLA does not exist");
        _;
    }

    /**
     * @dev Create a new SLA contract
     */
    function createSLA(
        address candidate,
        address company,
        SLAType slaType,
        uint256 responseTimeHours,
        uint256 penaltyAmount
    ) external onlyOwner returns (uint256) {
        _slaIdCounter++;
        uint256 newSlaId = _slaIdCounter;

        uint256 deadline = block.timestamp + (responseTimeHours * 1 hours);

        slaContracts[newSlaId] = SLAContract({
            slaId: newSlaId,
            candidate: candidate,
            company: company,
            slaType: slaType,
            responseTimeHours: responseTimeHours,
            penaltyAmount: penaltyAmount,
            createdAt: block.timestamp,
            deadline: deadline,
            isActive: true,
            isCompleted: false
        });

        userSLAs[candidate].push(newSlaId);
        userSLAs[company].push(newSlaId);

        emit SLACreated(newSlaId, candidate, company, slaType, deadline);

        return newSlaId;
    }

    /**
     * @dev Mark SLA as completed
     */
    function completeSLA(
        uint256 slaId
    ) external onlyParticipant(slaId) slaExists(slaId) {
        SLAContract storage sla = slaContracts[slaId];
        require(!sla.isCompleted, "SLA already completed");
        require(block.timestamp <= sla.deadline, "SLA deadline passed");

        sla.isCompleted = true;

        emit SLACompleted(slaId, msg.sender, block.timestamp);
    }

    /**
     * @dev Create violation when SLA is breached
     */
    function createViolation(
        uint256 slaId,
        address violator,
        ViolationSeverity severity,
        string memory reason
    ) external onlyOwner slaExists(slaId) returns (uint256) {
        SLAContract storage sla = slaContracts[slaId];
        require(!sla.isCompleted, "Cannot violate completed SLA");
        require(block.timestamp > sla.deadline, "SLA deadline not yet passed");

        _violationIdCounter++;
        uint256 newViolationId = _violationIdCounter;

        // Calculate penalty based on severity
        uint256 penaltyMultiplier = _getPenaltyMultiplier(severity);
        uint256 totalPenalty = (sla.penaltyAmount * penaltyMultiplier) / 100;

        violations[newViolationId] = SLAViolation({
            violationId: newViolationId,
            slaId: slaId,
            violator: violator,
            severity: severity,
            penaltyApplied: totalPenalty,
            violationTime: block.timestamp,
            reason: reason,
            penaltyPaid: false
        });

        userViolations[violator].push(newViolationId);
        userPenaltyBalance[violator] += totalPenalty;
        userViolationCount[violator]++;

        // Mark SLA as inactive
        sla.isActive = false;

        emit SLAViolated(
            newViolationId,
            slaId,
            violator,
            severity,
            totalPenalty
        );

        return newViolationId;
    }

    /**
     * @dev Pay penalty for violation
     */
    function payPenalty(uint256 violationId) external payable nonReentrant {
        SLAViolation storage violation = violations[violationId];
        require(violation.violator == msg.sender, "Not your violation");
        require(!violation.penaltyPaid, "Penalty already paid");
        require(msg.value >= violation.penaltyApplied, "Insufficient payment");

        violation.penaltyPaid = true;
        userPenaltyBalance[msg.sender] -= violation.penaltyApplied;

        // Refund excess payment
        if (msg.value > violation.penaltyApplied) {
            payable(msg.sender).transfer(msg.value - violation.penaltyApplied);
        }

        emit PenaltyPaid(violationId, msg.sender, violation.penaltyApplied);
    }

    /**
     * @dev Get penalty multiplier based on severity
     */
    function _getPenaltyMultiplier(
        ViolationSeverity severity
    ) private pure returns (uint256) {
        if (severity == ViolationSeverity.MINOR) return 100; // 100%
        if (severity == ViolationSeverity.MODERATE) return 150; // 150%
        if (severity == ViolationSeverity.SEVERE) return 200; // 200%
        if (severity == ViolationSeverity.CRITICAL) return 300; // 300%
        return 100;
    }

    /**
     * @dev Get user's SLA history
     */
    function getUserSLAs(
        address user
    ) external view returns (uint256[] memory) {
        return userSLAs[user];
    }

    /**
     * @dev Get user's violations
     */
    function getUserViolations(
        address user
    ) external view returns (uint256[] memory) {
        return userViolations[user];
    }

    /**
     * @dev Get user's current penalty balance
     */
    function getUserPenaltyBalance(
        address user
    ) external view returns (uint256) {
        return userPenaltyBalance[user];
    }

    /**
     * @dev Get user's violation count
     */
    function getUserViolationCount(
        address user
    ) external view returns (uint256) {
        return userViolationCount[user];
    }

    /**
     * @dev Check if SLA is overdue
     */
    function isSLAOverdue(
        uint256 slaId
    ) external view slaExists(slaId) returns (bool) {
        SLAContract memory sla = slaContracts[slaId];
        return !sla.isCompleted && block.timestamp > sla.deadline;
    }

    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
