import OpenAI from 'openai';

export interface MatchingResult {
    score: number; // 0-100
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

export class AIMatchingService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    /**
     * Match a developer to a job using AI analysis
     */
    async matchDeveloperToJob(
        developerProfile: any,
        jobPosting: any
    ): Promise<MatchingResult> {
        try {
            const prompt = this.buildMatchingPrompt(developerProfile, jobPosting);

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert Web3 recruiter and talent matcher. Analyze developer profiles against job requirements and provide detailed matching scores. Consider:
            1. Technical skills alignment
            2. Experience level match
            3. Web3/blockchain experience
            4. Open source contributions
            5. Culture fit based on company description and developer background
            
            Return your analysis in JSON format with the following structure:
            {
              "overallScore": number (0-100),
              "reasoning": "detailed explanation",
              "skillMatches": [
                {
                  "skill": "skill name",
                  "required": boolean,
                  "developerLevel": number (1-10),
                  "jobRequirement": number (1-10),
                  "match": number (0-100)
                }
              ],
              "cultureFit": number (0-100),
              "experienceMatch": number (0-100),
              "recommendations": "suggestions for both parties"
            }`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
            });

            const result = completion.choices[0]?.message?.content;
            if (!result) {
                throw new Error('No response from AI service');
            }

            const parsed = JSON.parse(result);

            return {
                score: parsed.overallScore,
                reasoning: parsed.reasoning,
                skillMatches: parsed.skillMatches,
                cultureFit: parsed.cultureFit,
                experienceMatch: parsed.experienceMatch,
            };
        } catch (error) {
            console.error('Error in AI matching:', error);
            // Fallback to rule-based matching
            return this.fallbackMatching(developerProfile, jobPosting);
        }
    }

    /**
     * Generate job recommendations for a developer
     */
    async getJobRecommendations(
        developerProfile: any,
        availableJobs: any[]
    ): Promise<Array<{ jobId: string, score: number, reasoning: string }>> {
        const recommendations = [];

        for (const job of availableJobs) {
            const match = await this.matchDeveloperToJob(developerProfile, job);
            if (match.score > 60) { // Only recommend good matches
                recommendations.push({
                    jobId: job.id,
                    score: match.score,
                    reasoning: match.reasoning
                });
            }
        }

        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10 recommendations
    }

    /**
     * Analyze developer fit for Web3 ecosystem
     */
    async analyzeWeb3Fit(githubStats: any, skills: any[]): Promise<number> {
        const web3Keywords = [
            'blockchain', 'ethereum', 'solidity', 'web3', 'defi', 'nft',
            'smart contract', 'dapp', 'crypto', 'bitcoin', 'tron', 'polygon'
        ];

        let score = 0;

        // Check skills for Web3 relevance
        const web3Skills = skills.filter(skill =>
            web3Keywords.some(keyword =>
                skill.name.toLowerCase().includes(keyword)
            )
        );
        score += web3Skills.length * 15;

        // Check GitHub repos for Web3 projects
        if (githubStats?.topRepos) {
            const web3Repos = githubStats.topRepos.filter((repo: any) =>
                web3Keywords.some(keyword =>
                    repo.name.toLowerCase().includes(keyword) ||
                    (repo.description && repo.description.toLowerCase().includes(keyword))
                )
            );
            score += web3Repos.length * 10;
        }

        // Check languages commonly used in Web3
        const web3Languages = ['solidity', 'rust', 'javascript', 'typescript', 'go'];
        if (githubStats?.languages) {
            const relevantLanguages = githubStats.languages.filter((lang: string) =>
                web3Languages.includes(lang.toLowerCase())
            );
            score += relevantLanguages.length * 5;
        }

        return Math.min(100, score);
    }

    /**
     * Build the prompt for AI matching
     */
    private buildMatchingPrompt(developerProfile: any, jobPosting: any): string {
        return `
DEVELOPER PROFILE:
- GitHub Username: ${developerProfile.githubUsername || 'N/A'}
- Experience: ${developerProfile.yearsOfExperience || 'N/A'} years
- Skills: ${developerProfile.skills?.map((s: any) => `${s.skill.name} (${s.proficiency}/10)`).join(', ') || 'N/A'}
- Location: ${developerProfile.location || 'N/A'}
- Bio: ${developerProfile.bio || 'N/A'}
- GitHub Stats: ${JSON.stringify(developerProfile.githubStats || {})}
- Available for work: ${developerProfile.availableForWork}
- Expected Salary: ${developerProfile.expectedSalary || 'N/A'}

JOB POSTING:
- Title: ${jobPosting.title}
- Company: ${jobPosting.company?.companyName || 'N/A'}
- Description: ${jobPosting.description}
- Requirements: ${jobPosting.requirements?.join(', ') || 'N/A'}
- Experience Level: ${jobPosting.experienceLevel}
- Location: ${jobPosting.location || 'Remote: ' + jobPosting.remote}
- Salary Range: ${jobPosting.salaryMin ? `$${jobPosting.salaryMin} - $${jobPosting.salaryMax}` : 'N/A'}
- Required Skills: ${jobPosting.skills?.map((s: any) => s.skill.name).join(', ') || 'N/A'}

Please analyze this match and provide a detailed scoring.
`;
    }

    /**
     * Fallback rule-based matching if AI fails
     */
    private fallbackMatching(developerProfile: any, jobPosting: any): MatchingResult {
        let score = 0;
        const skillMatches: SkillMatch[] = [];

        // Basic skill matching
        if (jobPosting.skills && developerProfile.skills) {
            const jobSkills = jobPosting.skills.map((s: any) => s.skill.name.toLowerCase());
            const devSkills = developerProfile.skills.map((s: any) => s.skill.name.toLowerCase());

            const matchingSkills = jobSkills.filter((skill: string) => devSkills.includes(skill));
            score = (matchingSkills.length / jobSkills.length) * 100;
        }

        return {
            score: Math.round(score),
            reasoning: 'Basic skill matching (AI service unavailable)',
            skillMatches,
            cultureFit: 50,
            experienceMatch: 50
        };
    }
}

export const aiMatchingService = new AIMatchingService();
