import express from 'express';
import { PrismaClient } from '@prisma/client';
import { antiGhostingService } from '../services/antiGhostingService.js';
import { notificationService } from '../services/notificationService.js';
const router = express.Router();
const prisma = new PrismaClient();
/**
 * Get application transparency dashboard
 * GET /api/applications/:id/dashboard
 */
router.get('/:id/dashboard', async (req, res) => {
    try {
        const { id } = req.params;
        const dashboard = await antiGhostingService.getApplicationDashboard(id);
        if (!dashboard) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(dashboard);
    }
    catch (error) {
        console.error('Error fetching application dashboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Update application status
 * PUT /api/applications/:id/status
 */
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, message } = req.body;
        // Get current application
        const currentApp = await prisma.application.findUnique({
            where: { id }
        });
        if (!currentApp) {
            return res.status(404).json({ error: 'Application not found' });
        }
        // Update status
        const updatedApp = await prisma.application.update({
            where: { id },
            data: {
                status,
                lastStatusUpdate: new Date()
            }
        });
        // Update deadline for new status
        await antiGhostingService.updateDeadline(id, status);
        // Send notification
        await notificationService.notifyApplicationStatusUpdate(id, currentApp.status, status, message);
        // Update company reputation
        if (status !== 'PENDING') {
            const application = await prisma.application.findUnique({
                where: { id },
                include: { job: true }
            });
            if (application) {
                await antiGhostingService.updateCompanyReputationScore(application.job.companyId);
            }
        }
        // Request feedback if application is completed
        if (['ACCEPTED', 'REJECTED'].includes(status)) {
            setTimeout(() => {
                antiGhostingService.requestCandidateFeedback(id);
            }, 24 * 60 * 60 * 1000); // Request feedback after 24 hours
        }
        res.json(updatedApp);
    }
    catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Submit candidate feedback
 * POST /api/applications/:id/feedback
 */
router.post('/:id/feedback', async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, feedback, recommend } = req.body;
        const application = await prisma.application.update({
            where: { id },
            data: {
                candidateFeedback: feedback,
                feedbackGiven: true
            },
            include: { job: true }
        });
        // Update company reputation with candidate satisfaction
        const reputationScore = await prisma.companyReputationScore.findUnique({
            where: { companyId: application.job.companyId }
        });
        if (reputationScore) {
            // Simple average calculation - in production you'd use weighted averages
            const newSatisfaction = (reputationScore.candidateSatisfaction + rating) / 2;
            await prisma.companyReputationScore.update({
                where: { companyId: application.job.companyId },
                data: {
                    candidateSatisfaction: newSatisfaction,
                    lastUpdated: new Date()
                }
            });
        }
        res.json({ message: 'Feedback submitted successfully' });
    }
    catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Get company reputation score
 * GET /api/companies/:id/reputation
 */
router.get('/companies/:id/reputation', async (req, res) => {
    try {
        const { id } = req.params;
        const reputation = await prisma.companyReputationScore.findUnique({
            where: { companyId: id },
            include: {
                company: {
                    select: {
                        companyName: true,
                        employeeCount: true,
                        fundingStage: true
                    }
                }
            }
        });
        if (!reputation) {
            return res.status(404).json({ error: 'Company reputation not found' });
        }
        // Calculate overall reputation grade
        const overallScore = (reputation.responseTimeScore * 0.3 +
            (100 - reputation.ghostingRate) * 0.4 +
            reputation.candidateSatisfaction * 0.3);
        const grade = overallScore >= 90 ? 'A+' :
            overallScore >= 80 ? 'A' :
                overallScore >= 70 ? 'B' :
                    overallScore >= 60 ? 'C' :
                        overallScore >= 50 ? 'D' : 'F';
        res.json({
            ...reputation,
            overallScore: Math.round(overallScore),
            grade,
            badges: calculateRepputationBadges(reputation)
        });
    }
    catch (error) {
        console.error('Error fetching company reputation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Get user notifications
 * GET /api/notifications
 */
router.get('/notifications', async (req, res) => {
    try {
        // In a real app, you'd get user ID from JWT token
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }
        const notifications = await notificationService.getUnreadNotifications(userId);
        res.json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
router.put('/notifications/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId; // In real app, get from JWT
        await notificationService.markAsRead(id, userId);
        res.json({ message: 'Notification marked as read' });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Generate AI communication suggestion
 * POST /api/applications/:id/communication-suggestion
 */
router.post('/:id/communication-suggestion', async (req, res) => {
    try {
        const { id } = req.params;
        const { context } = req.body; // 'status_update', 'rejection', 'interview_invite'
        const suggestion = await antiGhostingService.generateCommunicationSuggestion(id, context);
        res.json({ suggestion });
    }
    catch (error) {
        console.error('Error generating communication suggestion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Calculate reputation badges
 */
function calculateRepputationBadges(reputation) {
    const badges = [];
    if (reputation.responseTimeScore > 90)
        badges.push('Quick Responder');
    if (reputation.ghostingRate < 5)
        badges.push('No Ghosting');
    if (reputation.candidateSatisfaction > 4.5)
        badges.push('Candidate Favorite');
    if (reputation.totalApplications > 100)
        badges.push('High Volume Employer');
    if (reputation.averageResponseTime && reputation.averageResponseTime < 24)
        badges.push('Same Day Response');
    return badges;
}
export default router;
//# sourceMappingURL=applications.js.map