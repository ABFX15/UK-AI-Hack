import { PrismaClient } from '@prisma/client';
export class NotificationService {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    /**
     * Send notification to user via multiple channels
     */
    async sendNotification(userId, title, message, type = 'GENERAL_UPDATE', actionRequired = false) {
        // In a real implementation, you'd integrate with:
        // - Email service (SendGrid, AWS SES)
        // - Push notification service (Firebase, Pusher)
        // - SMS service (Twilio)
        console.log(`📧 Notification sent to user ${userId}:`);
        console.log(`Title: ${title}`);
        console.log(`Message: ${message}`);
        console.log(`Type: ${type}`);
        console.log(`Action Required: ${actionRequired}`);
        // For now, we'll just log the notification
        // In production, you'd send via email, push, etc.
    }
    /**
     * Send email notification
     */
    async sendEmailNotification(email, subject, body, template) {
        try {
            // Email service integration would go here
            console.log(`📧 Email sent to ${email}: ${subject}`);
            return true;
        }
        catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
    /**
     * Send push notification
     */
    async sendPushNotification(userId, title, body, data) {
        try {
            // Push notification service integration would go here
            console.log(`🔔 Push notification sent to ${userId}: ${title}`);
            return true;
        }
        catch (error) {
            console.error('Error sending push notification:', error);
            return false;
        }
    }
    /**
     * Process pending notifications
     */
    async processPendingNotifications() {
        const pendingNotifications = await this.prisma.applicationNotification.findMany({
            where: { sent: false },
            include: {
                application: {
                    include: {
                        user: true,
                        job: { include: { company: true } },
                        developer: { include: { user: true } }
                    }
                }
            }
        });
        for (const notification of pendingNotifications) {
            try {
                await this.sendNotification(notification.recipientId, notification.title, notification.message, notification.type, notification.actionRequired);
                // Mark as sent
                await this.prisma.applicationNotification.update({
                    where: { id: notification.id },
                    data: {
                        sent: true,
                        sentAt: new Date()
                    }
                });
            }
            catch (error) {
                console.error(`Error sending notification ${notification.id}:`, error);
            }
        }
    }
    /**
     * Mark notification as read
     */
    async markAsRead(notificationId, userId) {
        await this.prisma.applicationNotification.updateMany({
            where: {
                id: notificationId,
                recipientId: userId
            },
            data: {
                readAt: new Date()
            }
        });
    }
    /**
     * Get unread notifications for user
     */
    async getUnreadNotifications(userId) {
        return await this.prisma.applicationNotification.findMany({
            where: {
                recipientId: userId,
                readAt: null
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }
    /**
     * Send application status update notification
     */
    async notifyApplicationStatusUpdate(applicationId, oldStatus, newStatus, message) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                user: true,
                job: { include: { company: true } },
                developer: { include: { user: true } }
            }
        });
        if (!application)
            return;
        const statusMessage = message || this.getStatusUpdateMessage(oldStatus, newStatus);
        await this.prisma.applicationNotification.create({
            data: {
                applicationId,
                recipientId: application.userId,
                type: 'STATUS_UPDATE',
                title: `Application Status Updated: ${application.job.title}`,
                message: statusMessage,
                actionRequired: newStatus === 'INTERVIEWED' || newStatus === 'OFFERED'
            }
        });
    }
    /**
     * Send reminder to company about pending applications
     */
    async sendCompanyReminders() {
        const now = new Date();
        const reminderTime = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago
        const pendingApplications = await this.prisma.application.findMany({
            where: {
                status: 'PENDING',
                appliedAt: { lt: reminderTime },
                lastStatusUpdate: { lt: reminderTime }
            },
            include: {
                job: { include: { company: { include: { user: true } } } },
                developer: { include: { user: true } }
            }
        });
        const companiesWithPending = new Map();
        for (const application of pendingApplications) {
            const companyId = application.job.company.userId;
            if (!companiesWithPending.has(companyId)) {
                companiesWithPending.set(companyId, []);
            }
            companiesWithPending.get(companyId).push(application);
        }
        for (const [companyUserId, applications] of companiesWithPending) {
            const count = applications.length;
            await this.prisma.applicationNotification.create({
                data: {
                    applicationId: applications[0].id, // Use first application as reference
                    recipientId: companyUserId,
                    type: 'RESPONSE_DEADLINE_WARNING',
                    title: `${count} Pending Application${count > 1 ? 's' : ''} Need Your Attention`,
                    message: `You have ${count} candidate application${count > 1 ? 's' : ''} waiting for your response. Please review and respond to maintain a good reputation score.`,
                    actionRequired: true
                }
            });
        }
    }
    getStatusUpdateMessage(oldStatus, newStatus) {
        switch (newStatus) {
            case 'REVIEWED':
                return 'Great news! Your application has been reviewed and moved to the next stage.';
            case 'INTERVIEWED':
                return 'Congratulations! You\'ve been selected for an interview. Check your email for details.';
            case 'OFFERED':
                return 'Excellent! You\'ve received a job offer. Please review the details and respond promptly.';
            case 'ACCEPTED':
                return 'Welcome to the team! Your application has been accepted.';
            case 'REJECTED':
                return 'Thank you for your interest. While we\'ve decided to move forward with other candidates, we encourage you to apply for future opportunities.';
            case 'EXPIRED':
                return 'Your application has been automatically closed due to company non-response. This will be reflected in the company\'s reputation score.';
            default:
                return 'Your application status has been updated.';
        }
    }
}
export const notificationService = new NotificationService();
//# sourceMappingURL=notificationService.js.map