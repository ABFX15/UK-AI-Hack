import { Octokit } from '@octokit/rest';

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
    // Enhanced AI analysis fields
    skillScores?: { [key: string]: number };
    experienceLevel?: string;
    specializations?: string[];
    activityScore?: number;
    contributionQuality?: number;
    collaborationScore?: number;
    innovationScore?: number;
    overallScore?: number;
    strengths?: string[];
    areasForImprovement?: string[];
    recommendedRoles?: string[];
}

export class GitHubService {
    private octokit: Octokit;
    private aiServiceUrl: string;

    constructor() {
        this.octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN,
        });
        this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    }

    /**
     * Analyze a developer's GitHub profile with AI enhancement
     */
    async analyzeProfile(username: string, useAI: boolean = true): Promise<GitHubAnalysis> {
        try {
            // Get basic analysis first
            const basicAnalysis = await this.getBasicAnalysis(username);

            if (useAI) {
                // Enhance with AI analysis
                try {
                    const aiAnalysis = await this.getAIAnalysis(username);
                    return { ...basicAnalysis, ...aiAnalysis };
                } catch (aiError) {
                    console.warn('AI analysis failed, using basic analysis:', aiError);
                    return basicAnalysis;
                }
            }

            return basicAnalysis;
        } catch (error) {
            console.error(`Error analyzing GitHub profile for ${username}:`, error);
            throw error;
        }
    }

    /**
     * Get basic GitHub analysis (original implementation)
     */
    private async getBasicAnalysis(username: string): Promise<GitHubAnalysis> {
        try {
            // Get user info
            const { data: user } = await this.octokit.users.getByUsername({ username });

            // Get repositories
            const { data: repos } = await this.octokit.repos.listForUser({
                username,
                sort: 'updated',
                per_page: 100,
            });

            // Calculate metrics
            const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
            const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);

            // Get languages used
            const languages = await this.getLanguages(repos);

            // Get top repositories
            const topRepos = repos
                .filter(repo => !repo.fork)
                .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
                .slice(0, 10)
                .map(repo => ({
                    name: repo.name,
                    description: repo.description,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    language: repo.language,
                    url: repo.html_url,
                    lastUpdate: repo.updated_at
                }));

            // Get commit activity (simplified - in production you'd need to iterate through repos)
            const totalCommits = await this.estimateCommits(username, repos);

            // Calculate contribution score
            const contributionScore = this.calculateContributionScore({
                repos: repos.length,
                stars: totalStars,
                forks: totalForks,
                commits: totalCommits,
                followers: user.followers
            });

            return {
                username,
                totalCommits,
                totalRepos: repos.length,
                totalStars,
                totalForks,
                languages,
                topRepos,
                contributionScore,
                lastActive: new Date(user.updated_at)
            };
        } catch (error) {
            console.error(`Error analyzing GitHub profile for ${username}:`, error);
            throw error;
        }
    }

    /**
     * Get programming languages used by a developer
     */
    private async getLanguages(repos: any[]): Promise<string[]> {
        const languageCount: { [key: string]: number } = {};

        for (const repo of repos.slice(0, 20)) { // Limit to avoid rate limits
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        }

        return Object.keys(languageCount)
            .sort((a, b) => (languageCount[b] || 0) - (languageCount[a] || 0))
            .slice(0, 10);
    }

    /**
     * Estimate total commits (simplified approach)
     */
    private async estimateCommits(username: string, repos: any[]): Promise<number> {
        try {
            // This is a simplified estimation
            // In production, you'd use the GitHub GraphQL API for more accurate data
            let totalCommits = 0;

            for (const repo of repos.slice(0, 10)) { // Limit to avoid rate limits
                try {
                    const { data: commits } = await this.octokit.repos.listCommits({
                        owner: username,
                        repo: repo.name,
                        author: username,
                        per_page: 1
                    });

                    // This is a rough estimate - you'd need pagination for exact count
                    if (commits.length > 0) {
                        totalCommits += 50; // Rough estimate per active repo
                    }
                } catch (error) {
                    // Skip repos that cause errors (private, etc.)
                    continue;
                }
            }

            return totalCommits;
        } catch (error) {
            console.error('Error estimating commits:', error);
            return 0;
        }
    }

    /**
     * Calculate a contribution score based on various metrics
     */
    private calculateContributionScore(metrics: {
        repos: number;
        stars: number;
        forks: number;
        commits: number;
        followers: number;
    }): number {
        const weights = {
            repos: 0.2,
            stars: 0.3,
            forks: 0.2,
            commits: 0.2,
            followers: 0.1
        };

        // Normalize values (log scale for large numbers)
        const normalized = {
            repos: Math.log10(metrics.repos + 1) * 10,
            stars: Math.log10(metrics.stars + 1) * 15,
            forks: Math.log10(metrics.forks + 1) * 10,
            commits: Math.log10(metrics.commits + 1) * 12,
            followers: Math.log10(metrics.followers + 1) * 8
        };

        const score = Object.entries(normalized)
            .reduce((sum, [key, value]) => sum + value * weights[key as keyof typeof weights], 0);

        // Cap at 100
        return Math.min(100, Math.round(score));
    }

    /**
     * Verify if a GitHub profile is legitimate (not a bot/fake)
     */
    async verifyProfile(username: string): Promise<boolean> {
        try {
            const { data: user } = await this.octokit.users.getByUsername({ username });

            // Basic legitimacy checks
            const hasAvatar = !!user.avatar_url && !user.avatar_url.includes('gravatar');
            const hasBio = !!user.bio;
            const hasRepos = user.public_repos > 0;
            const accountAge = Date.now() - new Date(user.created_at).getTime();
            const isOldEnough = accountAge > 30 * 24 * 60 * 60 * 1000; // 30 days

            return hasAvatar && hasRepos && isOldEnough;
        } catch (error) {
            console.error(`Error verifying profile ${username}:`, error);
            return false;
        }
    }

    /**
     * Get AI-enhanced analysis from Python service
     */
    private async getAIAnalysis(username: string): Promise<Partial<GitHubAnalysis>> {
        try {
            const response = await fetch(`${this.aiServiceUrl}/analyze/github`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    include_detailed_analysis: true
                })
            });

            if (!response.ok) {
                throw new Error(`AI service responded with status: ${response.status}`);
            }

            const aiData = await response.json() as any;

            return {
                skillScores: aiData.skill_scores,
                experienceLevel: aiData.experience_level,
                specializations: aiData.specializations,
                activityScore: aiData.activity_score,
                contributionQuality: aiData.contribution_quality,
                collaborationScore: aiData.collaboration_score,
                innovationScore: aiData.innovation_score,
                overallScore: aiData.overall_score,
                strengths: aiData.strengths,
                areasForImprovement: aiData.areas_for_improvement,
                recommendedRoles: aiData.recommended_roles
            };
        } catch (error) {
            console.error('Failed to get AI analysis:', error);
            throw error;
        }
    }
}

export const githubService = new GitHubService();
