import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();

// AI Service base URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Analyze DeFi protocol risk
 * POST /api/compliance/analyze-protocol
 */
router.post('/analyze-protocol', async (req, res) => {
    try {
        const { protocol_address, institution_address } = req.body;

        if (!protocol_address) {
            return res.status(400).json({
                error: 'Protocol address is required'
            });
        }

        // Call AI service for risk analysis
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze-protocol-risk`, {
            protocol_address,
            institution_address
        });

        const riskAnalysis = aiResponse.data;

        // Store analysis result in database
        const complianceRecord = await prisma.complianceAnalysis.create({
            data: {
                protocolAddress: protocol_address,
                institutionAddress: institution_address || null,
                riskScore: riskAnalysis.risk_score,
                riskLevel: riskAnalysis.risk_level,
                recommendation: riskAnalysis.recommendation,
                maxExposurePercentage: riskAnalysis.max_exposure_percentage,
                analysisData: riskAnalysis,
                analysisTimestamp: new Date(riskAnalysis.analysis_timestamp)
            }
        });

        res.json({
            success: true,
            analysis: riskAnalysis,
            record_id: complianceRecord.id
        });

    } catch (error) {
        console.error('Protocol analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze protocol',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Analyze transaction for AML compliance
 * POST /api/compliance/analyze-transaction
 */
router.post('/analyze-transaction', async (req, res) => {
    try {
        const transactionData = req.body;

        if (!transactionData.tx_hash) {
            return res.status(400).json({
                error: 'Transaction hash is required'
            });
        }

        // Call AI service for AML analysis
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze-aml-compliance`, {
            transaction_data: transactionData
        });

        const amlAnalysis = aiResponse.data;

        // Store AML analysis result
        const amlRecord = await prisma.aMLAnalysis.create({
            data: {
                transactionHash: transactionData.tx_hash,
                amountUsd: transactionData.amount_usd || 0,
                counterpartyAddress: transactionData.counterparty_address || '',
                amlRiskScore: amlAnalysis.aml_risk_score,
                complianceLevel: amlAnalysis.compliance_level,
                suspiciousPatterns: amlAnalysis.suspicious_patterns,
                requiresManualReview: amlAnalysis.requires_manual_review,
                analysisData: amlAnalysis,
                analysisTimestamp: new Date(amlAnalysis.analysis_timestamp)
            }
        });

        res.json({
            success: true,
            analysis: amlAnalysis,
            record_id: amlRecord.id
        });

    } catch (error) {
        console.error('AML analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze transaction',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Generate compliance report for institution
 * GET /api/compliance/report/:institutionId
 */
router.get('/report/:institutionId', async (req, res) => {
    try {
        const { institutionId } = req.params;
        const { period = '30d' } = req.query;

        // Call AI service for comprehensive report
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/generate-compliance-report`, {
            institution_id: institutionId,
            time_period: period
        });

        const complianceReport = aiResponse.data;

        // Store report in database
        const reportRecord = await prisma.complianceReport.create({
            data: {
                institutionId,
                reportPeriod: period as string,
                overallComplianceScore: complianceReport.summary.overall_compliance_score,
                totalProtocolsAnalyzed: complianceReport.summary.total_protocols_analyzed,
                averageProtocolRisk: complianceReport.summary.average_protocol_risk,
                highRiskProtocols: complianceReport.summary.high_risk_protocols,
                totalTransactionsAnalyzed: complianceReport.summary.total_transactions_analyzed,
                flaggedTransactions: complianceReport.summary.flagged_transactions,
                reportData: complianceReport,
                generatedAt: new Date()
            }
        });

        res.json({
            success: true,
            report: complianceReport,
            record_id: reportRecord.id
        });

    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({
            error: 'Failed to generate compliance report',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Get historical compliance data for institution
 * GET /api/compliance/history/:institutionId
 */
router.get('/history/:institutionId', async (req, res) => {
    try {
        const { institutionId } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        // Get compliance analysis history
        const analyses = await prisma.complianceAnalysis.findMany({
            where: {
                institutionAddress: institutionId
            },
            orderBy: {
                analysisTimestamp: 'desc'
            },
            take: Number(limit),
            skip: Number(offset)
        });

        // Get AML analysis history
        const amlAnalyses = await prisma.aMLAnalysis.findMany({
            orderBy: {
                analysisTimestamp: 'desc'
            },
            take: Number(limit),
            skip: Number(offset)
        });

        res.json({
            success: true,
            data: {
                protocol_analyses: analyses,
                aml_analyses: amlAnalyses,
                total_records: analyses.length + amlAnalyses.length
            }
        });

    } catch (error) {
        console.error('History retrieval error:', error);
        res.status(500).json({
            error: 'Failed to retrieve compliance history',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Get real-time compliance dashboard data
 * GET /api/compliance/dashboard/:institutionId
 */
router.get('/dashboard/:institutionId', async (req, res) => {
    try {
        const { institutionId } = req.params;

        // Get recent analyses
        const recentAnalyses = await prisma.complianceAnalysis.findMany({
            where: {
                institutionAddress: institutionId,
                analysisTimestamp: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            },
            orderBy: {
                analysisTimestamp: 'desc'
            }
        });

        // Get flagged transactions
        const flaggedTransactions = await prisma.aMLAnalysis.findMany({
            where: {
                requiresManualReview: true,
                analysisTimestamp: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            },
            orderBy: {
                analysisTimestamp: 'desc'
            }
        });

        // Calculate aggregate metrics
        const avgRiskScore = recentAnalyses.length > 0
            ? recentAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / recentAnalyses.length
            : 0;

        const highRiskCount = recentAnalyses.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length;

        res.json({
            success: true,
            dashboard: {
                institution_id: institutionId,
                metrics: {
                    protocols_analyzed_24h: recentAnalyses.length,
                    average_risk_score: Math.round(avgRiskScore * 1000) / 1000,
                    high_risk_protocols: highRiskCount,
                    flagged_transactions_7d: flaggedTransactions.length,
                    compliance_status: avgRiskScore < 0.5 ? 'GOOD' : avgRiskScore < 0.7 ? 'MODERATE' : 'AT_RISK'
                },
                recent_analyses: recentAnalyses.slice(0, 10),
                flagged_transactions: flaggedTransactions.slice(0, 5),
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({
            error: 'Failed to retrieve dashboard data',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Update compliance settings for institution
 * PUT /api/compliance/settings/:institutionId
 */
router.put('/settings/:institutionId', async (req, res) => {
    try {
        const { institutionId } = req.params;
        const settings = req.body;

        // Upsert compliance settings
        const complianceSettings = await prisma.complianceSettings.upsert({
            where: {
                institutionId: institutionId
            },
            update: {
                riskToleranceLevel: settings.risk_tolerance_level || 'MEDIUM',
                maxExposurePercentage: settings.max_exposure_percentage || 15.0,
                enableAMLMonitoring: settings.enable_aml_monitoring !== false,
                enableProtocolWhitelist: settings.enable_protocol_whitelist !== false,
                customRiskParameters: settings.custom_risk_parameters || {},
                updatedAt: new Date()
            },
            create: {
                institutionId: institutionId,
                riskToleranceLevel: settings.risk_tolerance_level || 'MEDIUM',
                maxExposurePercentage: settings.max_exposure_percentage || 15.0,
                enableAMLMonitoring: settings.enable_aml_monitoring !== false,
                enableProtocolWhitelist: settings.enable_protocol_whitelist !== false,
                customRiskParameters: settings.custom_risk_parameters || {},
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.json({
            success: true,
            settings: complianceSettings
        });

    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({
            error: 'Failed to update compliance settings',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
