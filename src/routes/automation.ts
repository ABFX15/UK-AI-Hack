import express from 'express';
import { automationService } from '../services/automationService.js';

const router = express.Router();

/**
 * GET /automation/dashboard/:companyId
 * Get automation dashboard for a company
 */
router.get('/dashboard/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const { timeRange = '30d' } = req.query;

        // Get comprehensive dashboard data
        const [dashboardData, slaMetrics, analyticsData] = await Promise.all([
            automationService.getDashboardData(companyId),
            automationService.getSLADashboard(companyId),
            automationService.getAutomationAnalytics(companyId, timeRange as string)
        ]);

        res.json({
            success: true,
            data: {
                overview: dashboardData.overview,
                processes: {
                    active: dashboardData.activeSlas,
                    byStage: dashboardData.processesByStage,
                    recentActivity: dashboardData.recentActivity
                },
                sla: slaMetrics,
                automation: analyticsData,
                bottlenecks: dashboardData.bottlenecks,
                predictions: dashboardData.predictions,
                actionableItems: dashboardData.actionableItems,
                efficiency: dashboardData.efficiencyMetrics
            }
        });
    } catch (error) {
        console.error('Error fetching automation dashboard:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch automation dashboard'
        });
    }
});

/**
 * POST /automation/setup-workflows
 * Set up automated workflows for a company
 */
router.post('/setup-workflows', async (req, res) => {
    try {
        const { companyId, workflows } = req.body;

        if (!companyId || !workflows) {
            return res.status(400).json({
                success: false,
                error: 'Company ID and workflows configuration are required'
            });
        }

        const result = await automationService.setupAutomatedWorkflows(companyId, workflows);

        res.json({
            success: true,
            data: result,
            message: 'Automated workflows configured successfully'
        });
    } catch (error) {
        console.error('Error setting up workflows:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to set up automated workflows'
        });
    }
});

/**
 * POST /automation/trigger
 * Trigger automated actions based on events
 */
router.post('/trigger', async (req, res) => {
    try {
        const { eventType, data } = req.body;

        if (!eventType || !data) {
            return res.status(400).json({
                success: false,
                error: 'Event type and data are required'
            });
        }

        const result = await automationService.triggerAutomation(eventType, data);

        res.json({
            success: true,
            data: result,
            message: `Automation triggered for event: ${eventType}`
        });
    } catch (error) {
        console.error('Error triggering automation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to trigger automation'
        });
    }
});

/**
 * POST /automation/smart-matching
 * Find perfect matches using AI
 */
router.post('/smart-matching', async (req, res) => {
    try {
        const { jobId, candidatePool } = req.body;

        if (!jobId || !candidatePool) {
            return res.status(400).json({
                success: false,
                error: 'Job ID and candidate pool are required'
            });
        }

        const matches = await automationService.findPerfectMatches(jobId, candidatePool);

        res.json({
            success: true,
            data: {
                matches: matches,
                totalCandidates: candidatePool.length,
                matchesFound: matches.length,
                timestamp: new Date().toISOString()
            },
            message: 'Smart matching completed successfully'
        });
    } catch (error) {
        console.error('Error in smart matching:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to perform smart matching'
        });
    }
});

/**
 * POST /automation/create-process
 * Create a new hiring process with automation
 */
router.post('/create-process', async (req, res) => {
    try {
        const { applicationId, jobId, candidateId, companyId } = req.body;

        if (!applicationId || !jobId || !candidateId || !companyId) {
            return res.status(400).json({
                success: false,
                error: 'All process parameters are required'
            });
        }

        // Create the process and initial SLAs
        const [process, initialSLA] = await Promise.all([
            automationService.createHiringProcess(applicationId, jobId, candidateId, companyId),
            automationService.createSLA(applicationId, companyId, 'response_time', 24)
        ]);

        res.json({
            success: true,
            data: {
                process: process,
                initialSLA: initialSLA
            },
            message: 'Hiring process created with automated tracking'
        });
    } catch (error) {
        console.error('Error creating hiring process:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create hiring process'
        });
    }
});

/**
 * PUT /automation/advance-process/:processId
 * Advance a hiring process to the next stage
 */
router.put('/advance-process/:processId', async (req, res) => {
    try {
        const { processId } = req.params;
        const { newStage, actor, notes } = req.body;

        if (!newStage || !actor) {
            return res.status(400).json({
                success: false,
                error: 'New stage and actor are required'
            });
        }

        const result = await automationService.advanceProcess(processId, newStage, actor, notes);

        res.json({
            success: true,
            data: result,
            message: `Process advanced to ${newStage}`
        });
    } catch (error) {
        console.error('Error advancing process:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to advance process'
        });
    }
});

/**
 * POST /automation/add-blocker/:processId
 * Add a blocker to a hiring process
 */
router.post('/add-blocker/:processId', async (req, res) => {
    try {
        const { processId } = req.params;
        const { blockerType, description, severity = 'medium' } = req.body;

        if (!blockerType || !description) {
            return res.status(400).json({
                success: false,
                error: 'Blocker type and description are required'
            });
        }

        const blocker = await automationService.addBlocker(processId, blockerType, description, severity);

        res.json({
            success: true,
            data: blocker,
            message: 'Blocker added to process'
        });
    } catch (error) {
        console.error('Error adding blocker:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add blocker'
        });
    }
});

/**
 * GET /automation/recommendations/:companyId
 * Get process optimization recommendations
 */
router.get('/recommendations/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;

        const recommendations = await automationService.getOptimizationRecommendations(companyId);

        res.json({
            success: true,
            data: recommendations,
            message: 'Optimization recommendations generated'
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recommendations'
        });
    }
});

/**
 * POST /automation/simulate
 * Simulate hiring process scenarios
 */
router.post('/simulate', async (req, res) => {
    try {
        const { companyId, scenarios } = req.body;

        if (!companyId || !scenarios) {
            return res.status(400).json({
                success: false,
                error: 'Company ID and scenarios are required'
            });
        }

        const simulation = await automationService.simulateScenarios(companyId, scenarios);

        res.json({
            success: true,
            data: simulation,
            message: 'Scenario simulation completed'
        });
    } catch (error) {
        console.error('Error running simulation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run simulation'
        });
    }
});

/**
 * POST /automation/learn
 * Learn from successful hire
 */
router.post('/learn', async (req, res) => {
    try {
        const { candidateId, jobId, successMetrics } = req.body;

        if (!candidateId || !jobId || !successMetrics) {
            return res.status(400).json({
                success: false,
                error: 'Candidate ID, job ID, and success metrics are required'
            });
        }

        const result = await automationService.learnFromHire(candidateId, jobId, successMetrics);

        res.json({
            success: true,
            data: result,
            message: 'Learning from successful hire completed'
        });
    } catch (error) {
        console.error('Error learning from hire:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to learn from hire'
        });
    }
});

/**
 * POST /automation/notifications/setup
 * Set up smart notifications for a user
 */
router.post('/notifications/setup', async (req, res) => {
    try {
        const { userId, preferences } = req.body;

        if (!userId || !preferences) {
            return res.status(400).json({
                success: false,
                error: 'User ID and preferences are required'
            });
        }

        const result = await automationService.setupSmartNotifications(userId, preferences);

        res.json({
            success: true,
            data: result,
            message: 'Smart notifications configured'
        });
    } catch (error) {
        console.error('Error setting up notifications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to set up notifications'
        });
    }
});

export default router;
