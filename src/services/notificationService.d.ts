export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
}
export declare class NotificationService {
    private prisma;
    constructor();
    /**
     * Send notification to user via multiple channels
     */
    sendNotification(userId: string, title: string, message: string, type?: string, actionRequired?: boolean): Promise<void>;
    /**
     * Send email notification
     */
    sendEmailNotification(email: string, subject: string, body: string, template?: string): Promise<boolean>;
    /**
     * Send push notification
     */
    sendPushNotification(userId: string, title: string, body: string, data?: any): Promise<boolean>;
    /**
     * Process pending notifications
     */
    processPendingNotifications(): Promise<void>;
    /**
     * Mark notification as read
     */
    markAsRead(notificationId: string, userId: string): Promise<void>;
    /**
     * Get unread notifications for user
     */
    getUnreadNotifications(userId: string): Promise<any[]>;
    /**
     * Send application status update notification
     */
    notifyApplicationStatusUpdate(applicationId: string, oldStatus: string, newStatus: string, message?: string): Promise<void>;
    /**
     * Send reminder to company about pending applications
     */
    sendCompanyReminders(): Promise<void>;
    private getStatusUpdateMessage;
}
export declare const notificationService: NotificationService;
//# sourceMappingURL=notificationService.d.ts.map