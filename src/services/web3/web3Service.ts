import { ethers } from 'ethers';
import { config } from '../../config/config';

// Contract ABIs (you'll need to update these after compilation)
const REPUTATION_ABI = [
    // Simplified ABI - update with actual ABI after compilation
    "function createReputationScore(address user, uint256 githubScore, uint256 slaCompliance, uint256 professionalismScore, uint256 technicalScore, uint256 communicationScore) external",
    "function updateReputationScore(uint256 scoreId, uint256 newGithubScore, uint256 newSlaCompliance, uint256 newProfessionalismScore, uint256 newTechnicalScore, uint256 newCommunicationScore, string memory reason) external",
    "function getUserReputationScore(address user) external view returns (tuple(address userAddress, uint256 githubScore, uint256 slaCompliance, uint256 professionalismScore, uint256 technicalScore, uint256 communicationScore, uint256 totalScore, uint256 timestamp, bool isActive))",
    "event ReputationScoreCreated(uint256 indexed scoreId, address indexed user, uint256 totalScore)",
    "event ReputationScoreUpdated(uint256 indexed scoreId, address indexed user, uint256 oldScore, uint256 newScore, string reason)"
];

const SLA_ABI = [
    "function createSLA(address candidate, address company, uint8 slaType, uint256 responseTimeHours, uint256 penaltyAmount) external returns (uint256)",
    "function completeSLA(uint256 slaId) external",
    "function createViolation(uint256 slaId, address violator, uint8 severity, string memory reason) external returns (uint256)",
    "function payPenalty(uint256 violationId) external payable",
    "function getUserSLAs(address user) external view returns (uint256[] memory)",
    "function getUserViolations(address user) external view returns (uint256[] memory)",
    "function getUserPenaltyBalance(address user) external view returns (uint256)",
    "function isSLAOverdue(uint256 slaId) external view returns (bool)",
    "event SLACreated(uint256 indexed slaId, address indexed candidate, address indexed company, uint8 slaType, uint256 deadline)",
    "event SLAViolated(uint256 indexed violationId, uint256 indexed slaId, address indexed violator, uint8 severity, uint256 penalty)"
];

const MATCHING_ABI = [
    "function postJob(string memory title, string memory description, string[] memory requiredSkills, uint256 salaryMin, uint256 salaryMax, uint256 experienceRequired, uint256 deadlineInDays) external returns (uint256)",
    "function submitApplication(uint256 jobId, string memory githubProfile, string memory resumeHash) external returns (uint256)",
    "function updateApplicationStatus(uint256 applicationId, uint8 newStatus) external",
    "function calculateAndStoreMatch(uint256 jobId, address candidate, uint256 skillMatchScore, uint256 experienceScore, uint256 reputationScore) external",
    "function getMatchResult(uint256 jobId, address candidate) external view returns (tuple(uint256 jobId, address candidate, uint256 skillMatchScore, uint256 experienceScore, uint256 reputationScore, uint256 totalScore, uint256 timestamp))",
    "function getJobApplications(uint256 jobId) external view returns (uint256[] memory)",
    "event JobPosted(uint256 indexed jobId, address indexed company, string title, uint256 deadline)",
    "event ApplicationSubmitted(uint256 indexed applicationId, uint256 indexed jobId, address indexed candidate, uint256 matchScore)"
];

export interface ReputationScore {
    userAddress: string;
    githubScore: number;
    slaCompliance: number;
    professionalismScore: number;
    technicalScore: number;
    communicationScore: number;
    totalScore: number;
    timestamp: number;
    isActive: boolean;
}

export interface SLAContract {
    slaId: number;
    candidate: string;
    company: string;
    slaType: number;
    responseTimeHours: number;
    penaltyAmount: string;
    deadline: number;
    isActive: boolean;
    isCompleted: boolean;
}

export interface MatchResult {
    jobId: number;
    candidate: string;
    skillMatchScore: number;
    experienceScore: number;
    reputationScore: number;
    totalScore: number;
    timestamp: number;
}

class Web3Service {
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet;
    private reputationContract: ethers.Contract;
    private slaContract: ethers.Contract;
    private matchingContract: ethers.Contract;

    constructor() {
        // Initialize provider and signer
        this.provider = new ethers.JsonRpcProvider(config.web3.rpcUrl);
        this.signer = new ethers.Wallet(config.web3.privateKey, this.provider);

        // Initialize contracts
        this.reputationContract = new ethers.Contract(
            config.web3.contracts.reputationScore,
            REPUTATION_ABI,
            this.signer
        );

        this.slaContract = new ethers.Contract(
            config.web3.contracts.slaEnforcement,
            SLA_ABI,
            this.signer
        );

        this.matchingContract = new ethers.Contract(
            config.web3.contracts.talentMatching,
            MATCHING_ABI,
            this.signer
        );
    }

    // Reputation Score Methods
    async createReputationScore(
        userAddress: string,
        githubScore: number,
        slaCompliance: number,
        professionalismScore: number,
        technicalScore: number,
        communicationScore: number
    ): Promise<string> {
        try {
            const tx = await this.reputationContract.createReputationScore(
                userAddress,
                githubScore,
                slaCompliance,
                professionalismScore,
                technicalScore,
                communicationScore
            );
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error creating reputation score:', error);
            throw error;
        }
    }

    async getUserReputationScore(userAddress: string): Promise<ReputationScore> {
        try {
            const score = await this.reputationContract.getUserReputationScore(userAddress);
            return {
                userAddress: score.userAddress,
                githubScore: Number(score.githubScore),
                slaCompliance: Number(score.slaCompliance),
                professionalismScore: Number(score.professionalismScore),
                technicalScore: Number(score.technicalScore),
                communicationScore: Number(score.communicationScore),
                totalScore: Number(score.totalScore),
                timestamp: Number(score.timestamp),
                isActive: score.isActive
            };
        } catch (error) {
            console.error('Error getting reputation score:', error);
            throw error;
        }
    }

    async updateReputationScore(
        scoreId: number,
        newGithubScore: number,
        newSlaCompliance: number,
        newProfessionalismScore: number,
        newTechnicalScore: number,
        newCommunicationScore: number,
        reason: string
    ): Promise<string> {
        try {
            const tx = await this.reputationContract.updateReputationScore(
                scoreId,
                newGithubScore,
                newSlaCompliance,
                newProfessionalismScore,
                newTechnicalScore,
                newCommunicationScore,
                reason
            );
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error updating reputation score:', error);
            throw error;
        }
    }

    // SLA Enforcement Methods
    async createSLA(
        candidate: string,
        company: string,
        slaType: number,
        responseTimeHours: number,
        penaltyAmount: string
    ): Promise<{ txHash: string; slaId: number }> {
        try {
            const tx = await this.slaContract.createSLA(
                candidate,
                company,
                slaType,
                responseTimeHours,
                ethers.parseEther(penaltyAmount)
            );
            const receipt = await tx.wait();

            // Extract SLA ID from event logs
            const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id("SLACreated(uint256,address,address,uint8,uint256)"));
            const slaId = event ? parseInt(event.topics[1], 16) : 0;

            return { txHash: tx.hash, slaId };
        } catch (error) {
            console.error('Error creating SLA:', error);
            throw error;
        }
    }

    async completeSLA(slaId: number): Promise<string> {
        try {
            const tx = await this.slaContract.completeSLA(slaId);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error completing SLA:', error);
            throw error;
        }
    }

    async createViolation(
        slaId: number,
        violator: string,
        severity: number,
        reason: string
    ): Promise<{ txHash: string; violationId: number }> {
        try {
            const tx = await this.slaContract.createViolation(slaId, violator, severity, reason);
            const receipt = await tx.wait();

            // Extract violation ID from event logs
            const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id("SLAViolated(uint256,uint256,address,uint8,uint256)"));
            const violationId = event ? parseInt(event.topics[1], 16) : 0;

            return { txHash: tx.hash, violationId };
        } catch (error) {
            console.error('Error creating violation:', error);
            throw error;
        }
    }

    async getUserPenaltyBalance(userAddress: string): Promise<string> {
        try {
            const balance = await this.slaContract.getUserPenaltyBalance(userAddress);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error('Error getting penalty balance:', error);
            throw error;
        }
    }

    async isSLAOverdue(slaId: number): Promise<boolean> {
        try {
            return await this.slaContract.isSLAOverdue(slaId);
        } catch (error) {
            console.error('Error checking SLA status:', error);
            throw error;
        }
    }

    // Talent Matching Methods
    async postJob(
        title: string,
        description: string,
        requiredSkills: string[],
        salaryMin: number,
        salaryMax: number,
        experienceRequired: number,
        deadlineInDays: number
    ): Promise<{ txHash: string; jobId: number }> {
        try {
            const tx = await this.matchingContract.postJob(
                title,
                description,
                requiredSkills,
                salaryMin,
                salaryMax,
                experienceRequired,
                deadlineInDays
            );
            const receipt = await tx.wait();

            // Extract job ID from event logs
            const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id("JobPosted(uint256,address,string,uint256)"));
            const jobId = event ? parseInt(event.topics[1], 16) : 0;

            return { txHash: tx.hash, jobId };
        } catch (error) {
            console.error('Error posting job:', error);
            throw error;
        }
    }

    async submitApplication(
        jobId: number,
        githubProfile: string,
        resumeHash: string
    ): Promise<{ txHash: string; applicationId: number }> {
        try {
            const tx = await this.matchingContract.submitApplication(jobId, githubProfile, resumeHash);
            const receipt = await tx.wait();

            // Extract application ID from event logs
            const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id("ApplicationSubmitted(uint256,uint256,address,uint256)"));
            const applicationId = event ? parseInt(event.topics[1], 16) : 0;

            return { txHash: tx.hash, applicationId };
        } catch (error) {
            console.error('Error submitting application:', error);
            throw error;
        }
    }

    async calculateAndStoreMatch(
        jobId: number,
        candidate: string,
        skillMatchScore: number,
        experienceScore: number,
        reputationScore: number
    ): Promise<string> {
        try {
            const tx = await this.matchingContract.calculateAndStoreMatch(
                jobId,
                candidate,
                skillMatchScore,
                experienceScore,
                reputationScore
            );
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error calculating match:', error);
            throw error;
        }
    }

    async getMatchResult(jobId: number, candidate: string): Promise<MatchResult> {
        try {
            const result = await this.matchingContract.getMatchResult(jobId, candidate);
            return {
                jobId: Number(result.jobId),
                candidate: result.candidate,
                skillMatchScore: Number(result.skillMatchScore),
                experienceScore: Number(result.experienceScore),
                reputationScore: Number(result.reputationScore),
                totalScore: Number(result.totalScore),
                timestamp: Number(result.timestamp)
            };
        } catch (error) {
            console.error('Error getting match result:', error);
            throw error;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Listen for reputation score events
        this.reputationContract.on("ReputationScoreCreated", (scoreId, user, totalScore) => {
            console.log(`New reputation score created: ${scoreId} for ${user} with score ${totalScore}`);
            // Emit to real-time dashboard
        });

        this.reputationContract.on("ReputationScoreUpdated", (scoreId, user, oldScore, newScore, reason) => {
            console.log(`Reputation score updated: ${scoreId} for ${user} from ${oldScore} to ${newScore}. Reason: ${reason}`);
            // Emit to real-time dashboard
        });

        // Listen for SLA events
        this.slaContract.on("SLACreated", (slaId, candidate, company, slaType, deadline) => {
            console.log(`New SLA created: ${slaId} between ${candidate} and ${company}`);
            // Emit to real-time dashboard
        });

        this.slaContract.on("SLAViolated", (violationId, slaId, violator, severity, penalty) => {
            console.log(`SLA violation: ${violationId} for SLA ${slaId} by ${violator}`);
            // Emit to real-time dashboard and trigger notifications
        });

        // Listen for matching events
        this.matchingContract.on("JobPosted", (jobId, company, title, deadline) => {
            console.log(`New job posted: ${jobId} by ${company} - ${title}`);
            // Trigger matching algorithm
        });

        this.matchingContract.on("ApplicationSubmitted", (applicationId, jobId, candidate, matchScore) => {
            console.log(`New application: ${applicationId} for job ${jobId} by ${candidate} with score ${matchScore}`);
            // Trigger SLA creation and matching analysis
        });
    }

    // Utility Methods
    async getBlockNumber(): Promise<number> {
        return await this.provider.getBlockNumber();
    }

    async getGasPrice(): Promise<string> {
        const gasPrice = await this.provider.getFeeData();
        return ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei');
    }

    async getAccountBalance(address: string): Promise<string> {
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
    }
}

export const web3Service = new Web3Service();
