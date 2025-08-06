// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TalentMatching
 * @dev Manages candidate-job matching and hiring process
 */
contract TalentMatching is Ownable, ReentrancyGuard {
    uint256 private _jobIdCounter;
    uint256 private _applicationIdCounter;

    constructor(address initialOwner) Ownable(initialOwner) {
        _jobIdCounter = 0;
        _applicationIdCounter = 0;
    }

    enum JobStatus {
        OPEN,
        PAUSED,
        FILLED,
        CANCELLED
    }

    enum ApplicationStatus {
        SUBMITTED,
        SCREENING,
        INTERVIEW_SCHEDULED,
        INTERVIEWED,
        OFFER_EXTENDED,
        ACCEPTED,
        REJECTED,
        WITHDRAWN
    }

    struct JobPosting {
        uint256 jobId;
        address company;
        string title;
        string description;
        string[] requiredSkills;
        uint256 salaryMin;
        uint256 salaryMax;
        uint256 experienceRequired;
        JobStatus status;
        uint256 createdAt;
        uint256 deadline;
        bool isActive;
    }

    struct Application {
        uint256 applicationId;
        uint256 jobId;
        address candidate;
        uint256 matchScore;
        ApplicationStatus status;
        uint256 submittedAt;
        string githubProfile;
        string resumeHash;
        bool isActive;
    }

    struct MatchResult {
        uint256 jobId;
        address candidate;
        uint256 skillMatchScore;
        uint256 experienceScore;
        uint256 reputationScore;
        uint256 totalScore;
        uint256 timestamp;
    }

    // Mappings
    mapping(uint256 => JobPosting) public jobPostings;
    mapping(uint256 => Application) public applications;
    mapping(address => uint256[]) public companyJobs;
    mapping(address => uint256[]) public candidateApplications;
    mapping(uint256 => uint256[]) public jobApplications;
    mapping(bytes32 => MatchResult) public matchResults;

    // Events
    event JobPosted(
        uint256 indexed jobId,
        address indexed company,
        string title,
        uint256 deadline
    );

    event ApplicationSubmitted(
        uint256 indexed applicationId,
        uint256 indexed jobId,
        address indexed candidate,
        uint256 matchScore
    );

    event ApplicationStatusUpdated(
        uint256 indexed applicationId,
        ApplicationStatus oldStatus,
        ApplicationStatus newStatus
    );

    event MatchCalculated(
        uint256 indexed jobId,
        address indexed candidate,
        uint256 totalScore
    );

    // Modifiers
    modifier jobExists(uint256 jobId) {
        require(jobPostings[jobId].isActive, "Job does not exist");
        _;
    }

    modifier applicationExists(uint256 applicationId) {
        require(
            applications[applicationId].isActive,
            "Application does not exist"
        );
        _;
    }

    modifier onlyCompany(uint256 jobId) {
        require(
            jobPostings[jobId].company == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    /**
     * @dev Post a new job
     */
    function postJob(
        string memory title,
        string memory description,
        string[] memory requiredSkills,
        uint256 salaryMin,
        uint256 salaryMax,
        uint256 experienceRequired,
        uint256 deadlineInDays
    ) external returns (uint256) {
        _jobIdCounter++;
        uint256 newJobId = _jobIdCounter;

        uint256 deadline = block.timestamp + (deadlineInDays * 1 days);

        jobPostings[newJobId] = JobPosting({
            jobId: newJobId,
            company: msg.sender,
            title: title,
            description: description,
            requiredSkills: requiredSkills,
            salaryMin: salaryMin,
            salaryMax: salaryMax,
            experienceRequired: experienceRequired,
            status: JobStatus.OPEN,
            createdAt: block.timestamp,
            deadline: deadline,
            isActive: true
        });

        companyJobs[msg.sender].push(newJobId);

        emit JobPosted(newJobId, msg.sender, title, deadline);

        return newJobId;
    }

    /**
     * @dev Submit job application
     */
    function submitApplication(
        uint256 jobId,
        string memory githubProfile,
        string memory resumeHash
    ) external jobExists(jobId) returns (uint256) {
        JobPosting memory job = jobPostings[jobId];
        require(
            job.status == JobStatus.OPEN,
            "Job is not open for applications"
        );
        require(block.timestamp <= job.deadline, "Application deadline passed");

        _applicationIdCounter++;
        uint256 newApplicationId = _applicationIdCounter;

        // Calculate initial match score (simplified)
        uint256 matchScore = _calculateMatchScore(jobId, msg.sender);

        applications[newApplicationId] = Application({
            applicationId: newApplicationId,
            jobId: jobId,
            candidate: msg.sender,
            matchScore: matchScore,
            status: ApplicationStatus.SUBMITTED,
            submittedAt: block.timestamp,
            githubProfile: githubProfile,
            resumeHash: resumeHash,
            isActive: true
        });

        candidateApplications[msg.sender].push(newApplicationId);
        jobApplications[jobId].push(newApplicationId);

        emit ApplicationSubmitted(
            newApplicationId,
            jobId,
            msg.sender,
            matchScore
        );

        return newApplicationId;
    }

    /**
     * @dev Update application status
     */
    function updateApplicationStatus(
        uint256 applicationId,
        ApplicationStatus newStatus
    ) external applicationExists(applicationId) {
        Application storage application = applications[applicationId];
        JobPosting memory job = jobPostings[application.jobId];

        require(
            msg.sender == job.company ||
                msg.sender == application.candidate ||
                msg.sender == owner(),
            "Not authorized to update status"
        );

        ApplicationStatus oldStatus = application.status;
        application.status = newStatus;

        emit ApplicationStatusUpdated(applicationId, oldStatus, newStatus);
    }

    /**
     * @dev Calculate match score between candidate and job
     */
    function calculateAndStoreMatch(
        uint256 jobId,
        address candidate,
        uint256 skillMatchScore,
        uint256 experienceScore,
        uint256 reputationScore
    ) external onlyOwner jobExists(jobId) {
        uint256 totalScore = (skillMatchScore +
            experienceScore +
            reputationScore) / 3;

        bytes32 matchKey = keccak256(abi.encodePacked(jobId, candidate));

        matchResults[matchKey] = MatchResult({
            jobId: jobId,
            candidate: candidate,
            skillMatchScore: skillMatchScore,
            experienceScore: experienceScore,
            reputationScore: reputationScore,
            totalScore: totalScore,
            timestamp: block.timestamp
        });

        emit MatchCalculated(jobId, candidate, totalScore);
    }

    /**
     * @dev Get match result for job and candidate
     */
    function getMatchResult(
        uint256 jobId,
        address candidate
    ) external view returns (MatchResult memory) {
        bytes32 matchKey = keccak256(abi.encodePacked(jobId, candidate));
        return matchResults[matchKey];
    }

    /**
     * @dev Update job status
     */
    function updateJobStatus(
        uint256 jobId,
        JobStatus newStatus
    ) external onlyCompany(jobId) jobExists(jobId) {
        jobPostings[jobId].status = newStatus;
    }

    /**
     * @dev Get all applications for a job
     */
    function getJobApplications(
        uint256 jobId
    ) external view jobExists(jobId) returns (uint256[] memory) {
        return jobApplications[jobId];
    }

    /**
     * @dev Get all jobs posted by a company
     */
    function getCompanyJobs(
        address company
    ) external view returns (uint256[] memory) {
        return companyJobs[company];
    }

    /**
     * @dev Get all applications by a candidate
     */
    function getCandidateApplications(
        address candidate
    ) external view returns (uint256[] memory) {
        return candidateApplications[candidate];
    }

    /**
     * @dev Internal function to calculate basic match score
     */
    function _calculateMatchScore(
        uint256 /* jobId */,
        address /* candidate */
    ) private pure returns (uint256) {
        // Simplified scoring - in practice, this would integrate with reputation contract
        // and use AI/ML algorithms for more sophisticated matching
        return 75; // Placeholder score
    }

    /**
     * @dev Get job required skills
     */
    function getJobRequiredSkills(
        uint256 jobId
    ) external view jobExists(jobId) returns (string[] memory) {
        return jobPostings[jobId].requiredSkills;
    }
}
