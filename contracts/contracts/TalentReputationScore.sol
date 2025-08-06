// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TalentReputationScore
 * @dev Manages immutable reputation scores for candidates and companies
 */
contract TalentReputationScore is Ownable, ReentrancyGuard {
    uint256 private _scoreIdCounter;

    constructor(address initialOwner) Ownable(initialOwner) {
        _scoreIdCounter = 0;
    }

    struct ReputationScore {
        address userAddress;
        uint256 githubScore;
        uint256 slaCompliance;
        uint256 professionalismScore;
        uint256 technicalScore;
        uint256 communicationScore;
        uint256 totalScore;
        uint256 timestamp;
        bool isActive;
    }

    struct ScoreUpdate {
        uint256 scoreId;
        uint256 oldScore;
        uint256 newScore;
        string reason;
        uint256 timestamp;
        address updatedBy;
    }

    // Mappings
    mapping(uint256 => ReputationScore) public reputationScores;
    mapping(address => uint256) public userToLatestScore;
    mapping(address => uint256[]) public userScoreHistory;
    mapping(uint256 => ScoreUpdate[]) public scoreUpdates;

    // Events
    event ReputationScoreCreated(
        uint256 indexed scoreId,
        address indexed user,
        uint256 totalScore
    );

    event ReputationScoreUpdated(
        uint256 indexed scoreId,
        address indexed user,
        uint256 oldScore,
        uint256 newScore,
        string reason
    );

    // Modifiers
    modifier onlyValidScore(uint256 score) {
        require(score <= 100, "Score must be between 0 and 100");
        _;
    }

    modifier scoreExists(uint256 scoreId) {
        require(reputationScores[scoreId].isActive, "Score does not exist");
        _;
    }

    /**
     * @dev Create initial reputation score for a user
     */
    function createReputationScore(
        address user,
        uint256 githubScore,
        uint256 slaCompliance,
        uint256 professionalismScore,
        uint256 technicalScore,
        uint256 communicationScore
    )
        external
        onlyOwner
        onlyValidScore(githubScore)
        onlyValidScore(slaCompliance)
        onlyValidScore(professionalismScore)
        onlyValidScore(technicalScore)
        onlyValidScore(communicationScore)
    {
        _scoreIdCounter++;
        uint256 newScoreId = _scoreIdCounter;

        uint256 totalScore = (githubScore +
            slaCompliance +
            professionalismScore +
            technicalScore +
            communicationScore) / 5;

        reputationScores[newScoreId] = ReputationScore({
            userAddress: user,
            githubScore: githubScore,
            slaCompliance: slaCompliance,
            professionalismScore: professionalismScore,
            technicalScore: technicalScore,
            communicationScore: communicationScore,
            totalScore: totalScore,
            timestamp: block.timestamp,
            isActive: true
        });

        userToLatestScore[user] = newScoreId;
        userScoreHistory[user].push(newScoreId);

        emit ReputationScoreCreated(newScoreId, user, totalScore);
    }

    /**
     * @dev Update reputation score with reason
     */
    function updateReputationScore(
        uint256 scoreId,
        uint256 newGithubScore,
        uint256 newSlaCompliance,
        uint256 newProfessionalismScore,
        uint256 newTechnicalScore,
        uint256 newCommunicationScore,
        string memory reason
    ) external onlyOwner scoreExists(scoreId) {
        ReputationScore storage score = reputationScores[scoreId];
        uint256 oldTotalScore = score.totalScore;

        uint256 newTotalScore = (newGithubScore +
            newSlaCompliance +
            newProfessionalismScore +
            newTechnicalScore +
            newCommunicationScore) / 5;

        // Record the update
        scoreUpdates[scoreId].push(
            ScoreUpdate({
                scoreId: scoreId,
                oldScore: oldTotalScore,
                newScore: newTotalScore,
                reason: reason,
                timestamp: block.timestamp,
                updatedBy: msg.sender
            })
        );

        // Update the score
        score.githubScore = newGithubScore;
        score.slaCompliance = newSlaCompliance;
        score.professionalismScore = newProfessionalismScore;
        score.technicalScore = newTechnicalScore;
        score.communicationScore = newCommunicationScore;
        score.totalScore = newTotalScore;
        score.timestamp = block.timestamp;

        emit ReputationScoreUpdated(
            scoreId,
            score.userAddress,
            oldTotalScore,
            newTotalScore,
            reason
        );
    }

    /**
     * @dev Get user's current reputation score
     */
    function getUserReputationScore(
        address user
    ) external view returns (ReputationScore memory) {
        uint256 latestScoreId = userToLatestScore[user];
        require(latestScoreId > 0, "User has no reputation score");
        return reputationScores[latestScoreId];
    }

    /**
     * @dev Get user's score history
     */
    function getUserScoreHistory(
        address user
    ) external view returns (uint256[] memory) {
        return userScoreHistory[user];
    }

    /**
     * @dev Get score update history
     */
    function getScoreUpdates(
        uint256 scoreId
    ) external view returns (ScoreUpdate[] memory) {
        return scoreUpdates[scoreId];
    }
}
