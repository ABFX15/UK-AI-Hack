export interface GitHubAnalysis {
    username: string;
    totalCommits: number;
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    languages: string[];
    topRepos: any[];
    contributionScore: number;
    lastActive: Date;
}
export declare class GitHubService {
    private octokit;
    constructor();
    /**
     * Analyze a developer's GitHub profile
     */
    analyzeProfile(username: string): Promise<GitHubAnalysis>;
    /**
     * Get programming languages used by a developer
     */
    private getLanguages;
    /**
     * Estimate total commits (simplified approach)
     */
    private estimateCommits;
    /**
     * Calculate a contribution score based on various metrics
     */
    private calculateContributionScore;
    /**
     * Verify if a GitHub profile is legitimate (not a bot/fake)
     */
    verifyProfile(username: string): Promise<boolean>;
}
export declare const githubService: GitHubService;
//# sourceMappingURL=githubService.d.ts.map