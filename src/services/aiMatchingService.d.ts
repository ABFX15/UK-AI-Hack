export interface MatchingResult {
    score: number;
    reasoning: string;
    skillMatches: SkillMatch[];
    cultureFit: number;
    experienceMatch: number;
}
export interface SkillMatch {
    skill: string;
    required: boolean;
    developerLevel: number;
    jobRequirement: number;
    match: number;
}
export declare class AIMatchingService {
    private openai;
    constructor();
    /**
     * Match a developer to a job using AI analysis
     */
    matchDeveloperToJob(developerProfile: any, jobPosting: any): Promise<MatchingResult>;
    /**
     * Generate job recommendations for a developer
     */
    getJobRecommendations(developerProfile: any, availableJobs: any[]): Promise<Array<{
        jobId: string;
        score: number;
        reasoning: string;
    }>>;
    /**
     * Analyze developer fit for Web3 ecosystem
     */
    analyzeWeb3Fit(githubStats: any, skills: any[]): Promise<number>;
    /**
     * Build the prompt for AI matching
     */
    private buildMatchingPrompt;
    /**
     * Fallback rule-based matching if AI fails
     */
    private fallbackMatching;
}
export declare const aiMatchingService: AIMatchingService;
//# sourceMappingURL=aiMatchingService.d.ts.map