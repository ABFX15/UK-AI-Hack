export interface JobPosting {
    title: string;
    description: string;
    requirements: string[];
    benefits: string[];
    salaryRange: {
        min: number;
        max: number;
    };
    location: string;
    remote: boolean;
    experienceLevel: string;
    skills: string[];
}
export declare class CompanyService {
    private prisma;
    constructor();
    /**
     * Create or update company profile
     * TODO: Implement company profile management
     */
    createOrUpdateProfile(data: any): Promise<any>;
    /**
     * Verify company legitimacy using on-chain data
     * TODO: Implement company verification
     */
    verifyCompany(companyId: string): Promise<boolean>;
    /**
     * Create job posting with AI optimization
     * TODO: Implement job posting creation
     */
    createJobPosting(companyId: string, jobData: JobPosting): Promise<any>;
    /**
     * Get matched candidates for a job
     * TODO: Implement candidate matching
     */
    getMatchedCandidates(jobId: string): Promise<any[]>;
    /**
     * Update job posting
     * TODO: Implement job posting updates
     */
    updateJobPosting(jobId: string, updates: Partial<JobPosting>): Promise<any>;
    /**
     * Get company analytics and metrics
     * TODO: Implement company analytics
     */
    getCompanyAnalytics(companyId: string): Promise<any>;
    /**
     * Manage job applications
     * TODO: Implement application management
     */
    getApplications(companyId: string, filters?: any): Promise<any[]>;
    /**
     * Respond to candidate application
     * TODO: Implement application response
     */
    respondToApplication(applicationId: string, response: any): Promise<void>;
    /**
     * Get company reputation dashboard
     * TODO: Implement reputation dashboard
     */
    getReputationDashboard(companyId: string): Promise<any>;
    /**
     * Schedule interview with candidate
     * TODO: Implement interview scheduling
     */
    scheduleInterview(applicationId: string, interviewData: any): Promise<any>;
    /**
     * Generate AI-powered job description
     * TODO: Implement AI job description generation
     */
    generateJobDescription(basicInfo: any): Promise<string>;
    /**
     * Search and filter jobs
     * TODO: Implement job search
     */
    searchJobs(filters: any): Promise<any[]>;
}
export declare const companyService: CompanyService;
//# sourceMappingURL=companyService.d.ts.map