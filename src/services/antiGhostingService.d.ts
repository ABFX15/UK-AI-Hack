export interface AntiGhostingConfig {
    initialResponseDeadlineHours: number;
    interviewResponseDeadlineHours: number;
    finalDecisionDeadlineHours: number;
    warningBeforeDeadlineHours: number;
}
export declare class AntiGhostingService {
    private prisma;
    private openai;
    private config;
    constructor();
    /**
     * Set response deadline when application is created
     */
    setInitialDeadline(applicationId: string): Promise<void>;
    /**
     * Update deadline when status changes
     */
    updateDeadline(applicationId: string, newStatus: string): Promise<void>;
    /**
     * Check for overdue applications and auto-reject them
     */
    processOverdueApplications(): Promise<void>;
    /**
     * Auto-reject an overdue application
     */
    private autoRejectApplication;
    /**
     * Schedule warning notification before deadline
     */
    private scheduleWarningNotification;
    /**
     * Create a notification
     */
    private createNotification;
    /**
     * Update company reputation score based on response behavior
     */
    updateCompanyReputationScore(companyId: string): Promise<void>;
    /**
     * Request feedback from candidate after application process
     */
    requestCandidateFeedback(applicationId: string): Promise<void>;
    /**
     * Generate AI-powered communication suggestions
     */
    generateCommunicationSuggestion(applicationId: string, context: 'status_update' | 'rejection' | 'interview_invite'): Promise<string>;
    private buildCommunicationPrompt;
    private getFallbackMessage;
    /**
     * Get application transparency dashboard data
     */
    getApplicationDashboard(applicationId: string): Promise<any>;
    private calculateEstimatedResponseTime;
}
export declare const antiGhostingService: AntiGhostingService;
//# sourceMappingURL=antiGhostingService.d.ts.map