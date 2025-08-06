import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

export interface AntiGhostingConfig {
    initialResponseDeadlineHours: number;  // Default: 72 hours
    interviewResponseDeadlineHours: number; // Default: 48 hours
    finalDecisionDeadlineHours: number;    // Default: 120 hours
    warningBeforeDeadlineHours: number;    // Send warning 24 hours before
}

export class AntiGhostingService {
    private prisma: PrismaClient;
    private openai: OpenAI;
    private config: AntiGhostingConfig;

    constructor() {
        this.prisma = new PrismaClient();
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        this.config = {
            initialResponseDeadlineHours: 72,
            interviewResponseDeadlineHours: 48,
            finalDecisionDeadlineHours: 120,
            warningBeforeDeadlineHours: 24
        };
    }

    /**
     * Set response deadline when application is created
     */
    async setInitialDeadline(applicationId: string): Promise<void> {
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + this.config.initialResponseDeadlineHours);

        await this.prisma.application.update({
            where: { id: applicationId },
            data: {
                responseDeadline: deadline,
                lastStatusUpdate: new Date()
            }
        });

        // Schedule warning notification
        await this.scheduleWarningNotification(applicationId, deadline);
    }

    /**
     * Update deadline when status changes
     */
    async updateDeadline(applicationId: string, newStatus: string): Promise<void> {
        let hoursToAdd = 0;

        switch (newStatus) {
            case 'REVIEWED':
                hoursToAdd = this.config.interviewResponseDeadlineHours;
                break;
            case 'INTERVIEWED':
                hoursToAdd = this.config.finalDecisionDeadlineHours;
                break;
            default:
                return; // No deadline update needed
        }

        const deadline = new Date();
        deadline.setHours(deadline.getHours() + hoursToAdd);

        await this.prisma.application.update({
            where: { id: applicationId },
            data: {
                responseDeadline: deadline,
                lastStatusUpdate: new Date()
            }
        });

        // Add to timeline
        await this.prisma.applicationTimeline.create({
            data: {
                applicationId,
                status: newStatus as any,
                changedAt: new Date(),
                automated: false
            }
        });

        await this.scheduleWarningNotification(applicationId, deadline);
    }

    /**
     * Check for overdue applications and auto-reject them
     */
    async processOverdueApplications(): Promise<void> {
        const now = new Date();

        const overdueApplications = await this.prisma.application.findMany({
            where: {
                responseDeadline: { lt: now },
                status: { in: ['PENDING', 'REVIEWED', 'INTERVIEWED'] },
                autoRejectedAt: null
            },
            include: {
                job: { include: { company: true } },
                developer: { include: { user: true } }
            }
        });

        for (const application of overdueApplications) {
            await this.autoRejectApplication(application);
            await this.updateCompanyReputationScore(application.job.companyId);
        }
    }

    /**
     * Auto-reject an overdue application
     */
    private async autoRejectApplication(application: any): Promise<void> {
        await this.prisma.application.update({
            where: { id: application.id },
            data: {
                status: 'EXPIRED',
                autoRejectedAt: new Date(),
                lastStatusUpdate: new Date()
            }
        });

        // Add to timeline
        await this.prisma.applicationTimeline.create({
            data: {
                applicationId: application.id,
                status: 'EXPIRED',
                changedAt: new Date(),
                automated: true,
                notes: 'Automatically rejected due to company response timeout'
            }
        });

        // Notify candidate
        await this.createNotification({
            applicationId: application.id,
            recipientId: application.userId,
            type: 'STATUS_UPDATE',
            title: 'Application Status Updated',
            message: `Your application for ${application.job.title} has been automatically closed due to company non-response. This will affect the company's reputation score.`,
            actionRequired: false
        });

        // Notify company
        await this.createNotification({
            applicationId: application.id,
            recipientId: application.job.postedById,
            type: 'RESPONSE_OVERDUE',
            title: 'Application Auto-Rejected',
            message: `The application from ${application.developer.user.username} for ${application.job.title} has been automatically rejected due to response timeout. This affects your company reputation score.`,
            actionRequired: true
        });
    }

    /**
     * Schedule warning notification before deadline
     */
    private async scheduleWarningNotification(applicationId: string, deadline: Date): Promise<void> {
        const warningTime = new Date(deadline);
        warningTime.setHours(warningTime.getHours() - this.config.warningBeforeDeadlineHours);

        if (warningTime > new Date()) {
            // In a production environment, you'd use a job queue like Bull or Agenda
            // For now, we'll create the notification to be sent later
            const application = await this.prisma.application.findUnique({
                where: { id: applicationId },
                include: {
                    job: { include: { company: { include: { user: true } } } },
                    developer: { include: { user: true } }
                }
            });

            if (application) {
                await this.createNotification({
                    applicationId,
                    recipientId: application.job.postedById,
                    type: 'RESPONSE_DEADLINE_WARNING',
                    title: 'Response Deadline Approaching',
                    message: `You have 24 hours to respond to ${application.developer.user.username}'s application for ${application.job.title}. Failure to respond will result in auto-rejection and impact your reputation score.`,
                    actionRequired: true
                });
            }
        }
    }

    /**
     * Create a notification
     */
    private async createNotification(data: {
        applicationId: string;
        recipientId: string;
        type: string;
        title: string;
        message: string;
        actionRequired: boolean;
    }): Promise<void> {
        await this.prisma.applicationNotification.create({
            data: {
                ...data,
                type: data.type as any
            }
        });
    }

    /**
     * Update company reputation score based on response behavior
     */
    async updateCompanyReputationScore(companyId: string): Promise<void> {
        const applications = await this.prisma.application.findMany({
            where: {
                job: { companyId }
            }
        });

        const totalApplications = applications.length;
        const respondedApplications = applications.filter((app: any) =>
            app.status !== 'PENDING' && app.status !== 'EXPIRED'
        ).length;

        const expiredApplications = applications.filter((app: any) =>
            app.status === 'EXPIRED'
        ).length;

        const ghostingRate = totalApplications > 0 ? (expiredApplications / totalApplications) * 100 : 0;
        const responseRate = totalApplications > 0 ? (respondedApplications / totalApplications) * 100 : 0;

        // Calculate average response time
        const responseTimes = applications
            .filter((app: any) => app.status !== 'PENDING' && app.lastStatusUpdate)
            .map((app: any) => {
                const responseTime = app.lastStatusUpdate.getTime() - app.appliedAt.getTime();
                return responseTime / (1000 * 60 * 60); // Convert to hours
            });

        const averageResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
            : null;

        // Calculate overall score (lower ghosting rate = higher score)
        const responseTimeScore = averageResponseTime
            ? Math.max(0, 100 - (averageResponseTime / 24) * 20) // Penalize slow responses
            : 50;

        await this.prisma.companyReputationScore.upsert({
            where: { companyId },
            update: {
                responseTimeScore,
                ghostingRate,
                totalApplications,
                respondedApplications,
                averageResponseTime,
                lastUpdated: new Date()
            },
            create: {
                companyId,
                responseTimeScore,
                ghostingRate,
                totalApplications,
                respondedApplications,
                averageResponseTime,
                candidateSatisfaction: 0,
                lastUpdated: new Date()
            }
        });
    }

    /**
     * Request feedback from candidate after application process
     */
    async requestCandidateFeedback(applicationId: string): Promise<void> {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                job: { include: { company: true } },
                user: true
            }
        });

        if (!application || application.feedbackGiven) return;

        await this.createNotification({
            applicationId,
            recipientId: application.userId,
            type: 'FEEDBACK_REQUEST',
            title: 'Help Improve the Platform',
            message: `How was your experience with ${application.job.company.companyName}? Your feedback helps us improve the platform and helps other candidates.`,
            actionRequired: false
        });
    }

    /**
     * Generate AI-powered communication suggestions
     */
    async generateCommunicationSuggestion(
        applicationId: string,
        context: 'status_update' | 'rejection' | 'interview_invite'
    ): Promise<string> {
        try {
            const application = await this.prisma.application.findUnique({
                where: { id: applicationId },
                include: {
                    job: true,
                    developer: { include: { user: true } }
                }
            });

            if (!application) return '';

            const prompt = this.buildCommunicationPrompt(application, context);

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional recruitment communication assistant. Generate empathetic, clear, and actionable messages that respect candidates' time and provide valuable feedback."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 300
            });

            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Error generating communication suggestion:', error);
            return this.getFallbackMessage(context);
        }
    }

    private buildCommunicationPrompt(application: any, context: string): string {
        const candidateName = application.developer.user.username;
        const jobTitle = application.job.title;

        switch (context) {
            case 'status_update':
                return `Write a professional message updating ${candidateName} about their application status for ${jobTitle}. Include next steps and timeline.`;

            case 'rejection':
                return `Write a respectful rejection message for ${candidateName}'s application for ${jobTitle}. Include specific feedback and encourage them to apply for future positions.`;

            case 'interview_invite':
                return `Write an interview invitation for ${candidateName} for the ${jobTitle} position. Include format, duration, and what to expect.`;

            default:
                return `Write a professional message to ${candidateName} regarding their application for ${jobTitle}.`;
        }
    }

    private getFallbackMessage(context: string): string {
        switch (context) {
            case 'rejection':
                return "Thank you for your interest in this position. While we've decided to move forward with other candidates, we encourage you to apply for future opportunities that match your skills.";

            case 'interview_invite':
                return "We're pleased to invite you for an interview. We'll be in touch shortly with scheduling details.";

            default:
                return "Thank you for your application. We'll be in touch with updates soon.";
        }
    }

    /**
     * Get application transparency dashboard data
     */
    async getApplicationDashboard(applicationId: string): Promise<any> {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                timeline: { orderBy: { changedAt: 'asc' } },
                notifications: { orderBy: { createdAt: 'desc' } },
                job: {
                    include: {
                        company: {
                            include: { reputationScore: true }
                        }
                    }
                }
            }
        });

        if (!application) return null;

        return {
            application: {
                id: application.id,
                status: application.status,
                appliedAt: application.appliedAt,
                responseDeadline: application.responseDeadline,
                aiScore: application.aiScore
            },
            timeline: application.timeline,
            companyReputation: application.job.company.reputationScore,
            estimatedResponseTime: this.calculateEstimatedResponseTime(application.job.company.reputationScore),
            notifications: application.notifications.slice(0, 5) // Latest 5 notifications
        };
    }

    private calculateEstimatedResponseTime(reputationScore: any): string {
        if (!reputationScore?.averageResponseTime) return 'No data available';

        const hours = reputationScore.averageResponseTime;
        if (hours < 24) return `${Math.round(hours)} hours`;
        return `${Math.round(hours / 24)} days`;
    }
}

export const antiGhostingService = new AntiGhostingService();
