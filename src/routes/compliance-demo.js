import { Router } from 'express';
import axios from 'axios';
const router = Router();
// AI Service base URL  
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
/**
 * Demo: Analyze DeFi protocol risk
 * POST /api/compliance/demo/analyze-protocol
 */
router.post('/demo/analyze-protocol', async (req, res) => {
    try {
        const { protocol_address, institution_address } = req.body;
        if (!protocol_address) {
            return res.status(400).json({
                error: 'Protocol address is required'
            });
        }
        // Demo data for protocol analysis
        const demoProtocols = {
            "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9": {
                protocol_name: "Aave V2",
                risk_score: 0.15,
                risk_level: "LOW",
                recommendation: "APPROVED_FOR_INSTITUTIONAL_USE",
                max_exposure_percentage: 25.0,
                tvl_usd: 5200000000,
                audit_status: "MULTIPLE_AUDITS",
                confidence_score: 0.95,
                monitoring_alerts: [],
                analysis_timestamp: new Date().toISOString()
            },
            "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B": {
                protocol_name: "Compound",
                risk_score: 0.18,
                risk_level: "LOW",
                recommendation: "APPROVED_FOR_INSTITUTIONAL_USE",
                max_exposure_percentage: 20.0,
                tvl_usd: 3800000000,
                audit_status: "AUDITED",
                confidence_score: 0.92,
                monitoring_alerts: [],
                analysis_timestamp: new Date().toISOString()
            }
        };
        const result = demoProtocols[protocol_address.toLowerCase()] || {
            protocol_name: `Unknown Protocol ${protocol_address.substring(0, 8)}`,
            risk_score: 0.75,
            risk_level: "HIGH",
            recommendation: "REQUIRES_ADDITIONAL_REVIEW",
            max_exposure_percentage: 0.0,
            tvl_usd: 50000000,
            audit_status: "UNAUDITED",
            confidence_score: 0.3,
            monitoring_alerts: ["SMART_CONTRACT_SECURITY_CONCERN", "HIGH_LIQUIDITY_RISK"],
            analysis_timestamp: new Date().toISOString()
        };
        res.json({
            success: true,
            analysis: {
                protocol_address,
                ...result
            },
            demo_mode: true
        });
    }
    catch (error) {
        console.error('Demo protocol analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze protocol',
            message: 'Demo service error'
        });
    }
});
/**
 * Demo: Analyze transaction for AML compliance
 * POST /api/compliance/demo/analyze-transaction
 */
router.post('/demo/analyze-transaction', async (req, res) => {
    try {
        const { tx_hash, amount_usd, counterparty_address } = req.body;
        if (!tx_hash) {
            return res.status(400).json({
                error: 'Transaction hash is required'
            });
        }
        // Demo AML analysis based on amount and counterparty
        let aml_risk_score = 0.1;
        let suspicious_patterns = [];
        let compliance_level = "COMPLIANT";
        if (amount_usd > 10000) {
            aml_risk_score += 0.3;
            suspicious_patterns.push("LARGE_TRANSACTION");
        }
        if (counterparty_address === "0x7F367cC41522cE07553e823bf3be79A889DEbe1B") {
            aml_risk_score += 0.8;
            suspicious_patterns.push("SANCTIONED_COUNTERPARTY");
            compliance_level = "BLOCKED";
        }
        if (aml_risk_score > 0.5) {
            compliance_level = "REQUIRES_REVIEW";
        }
        res.json({
            success: true,
            analysis: {
                transaction_id: tx_hash,
                aml_risk_score: Math.round(aml_risk_score * 1000) / 1000,
                compliance_level,
                suspicious_patterns,
                requires_manual_review: aml_risk_score > 0.5,
                analysis_timestamp: new Date().toISOString()
            },
            demo_mode: true
        });
    }
    catch (error) {
        console.error('Demo AML analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze transaction',
            message: 'Demo service error'
        });
    }
});
/**
 * Demo: Get compliance dashboard data
 * GET /api/compliance/demo/dashboard/:institutionId
 */
router.get('/demo/dashboard/:institutionId', async (req, res) => {
    try {
        const { institutionId } = req.params;
        // Demo dashboard data
        const dashboardData = {
            institution_id: institutionId,
            metrics: {
                protocols_analyzed_24h: 15,
                average_risk_score: 0.245,
                high_risk_protocols: 2,
                flagged_transactions_7d: 3,
                compliance_status: 'GOOD'
            },
            recent_analyses: [
                {
                    id: 'analysis_001',
                    protocolAddress: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
                    protocolName: 'Aave V2',
                    riskScore: 0.15,
                    riskLevel: 'LOW',
                    analysisTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'analysis_002',
                    protocolAddress: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
                    protocolName: 'Compound',
                    riskScore: 0.18,
                    riskLevel: 'LOW',
                    analysisTimestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
                }
            ],
            flagged_transactions: [
                {
                    id: 'aml_001',
                    transactionHash: '0xabc123def456789...',
                    amlRiskScore: 0.85,
                    complianceLevel: 'REQUIRES_REVIEW',
                    analysisTimestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
                }
            ],
            alerts: [
                {
                    id: 'alert_001',
                    type: 'REGULATORY_UPDATE',
                    severity: 'MEDIUM',
                    title: 'Basel III Update',
                    description: 'New capital requirements for crypto exposures',
                    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            timestamp: new Date().toISOString()
        };
        res.json({
            success: true,
            dashboard: dashboardData,
            demo_mode: true
        });
    }
    catch (error) {
        console.error('Demo dashboard error:', error);
        res.status(500).json({
            error: 'Failed to retrieve dashboard data',
            message: 'Demo service error'
        });
    }
});
/**
 * Demo: Get market overview
 * GET /api/compliance/demo/market-overview
 */
router.get('/demo/market-overview', async (req, res) => {
    try {
        const marketOverview = {
            total_tvl_usd: 45000000000,
            protocols_analyzed: 250,
            high_risk_protocols: 45,
            compliant_protocols: 180,
            market_trend: "STABLE",
            risk_distribution: {
                "LOW": 25,
                "MEDIUM": 45,
                "HIGH": 25,
                "CRITICAL": 5
            },
            top_protocols: [
                { name: "Aave V2", tvl: 5200000000, risk_level: "LOW" },
                { name: "Compound", tvl: 3800000000, risk_level: "LOW" },
                { name: "Uniswap V3", tvl: 3100000000, risk_level: "MEDIUM" },
                { name: "MakerDAO", tvl: 2900000000, risk_level: "LOW" },
                { name: "Curve Finance", tvl: 2400000000, risk_level: "MEDIUM" }
            ],
            regulatory_updates: [
                {
                    date: "2024-01-15",
                    title: "EU MiCA Regulation Update",
                    impact: "MEDIUM"
                },
                {
                    date: "2024-01-10",
                    title: "Basel III Crypto Capital Requirements",
                    impact: "HIGH"
                }
            ],
            timestamp: new Date().toISOString()
        };
        res.json({
            success: true,
            market: marketOverview,
            demo_mode: true
        });
    }
    catch (error) {
        console.error('Demo market overview error:', error);
        res.status(500).json({
            error: 'Failed to retrieve market overview',
            message: 'Demo service error'
        });
    }
});
/**
 * Demo: Generate compliance report
 * GET /api/compliance/demo/report/:institutionId
 */
router.get('/demo/report/:institutionId', async (req, res) => {
    try {
        const { institutionId } = req.params;
        const { period = '30d' } = req.query;
        const complianceReport = {
            institution_id: institutionId,
            report_period: period,
            summary: {
                total_protocols_analyzed: 18,
                average_protocol_risk: 0.287,
                high_risk_protocols: 3,
                total_transactions_analyzed: 1247,
                flagged_transactions: 12,
                overall_compliance_score: 0.765
            },
            protocol_breakdown: [
                {
                    protocol_address: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
                    protocol_name: "Aave V2",
                    risk_score: 0.15,
                    risk_level: "LOW",
                    recommendation: "APPROVED_FOR_INSTITUTIONAL_USE",
                    exposure_percentage: 22.5
                },
                {
                    protocol_address: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
                    protocol_name: "Compound",
                    risk_score: 0.18,
                    risk_level: "LOW",
                    recommendation: "APPROVED_FOR_INSTITUTIONAL_USE",
                    exposure_percentage: 18.3
                }
            ],
            high_risk_protocols: [
                {
                    protocol_address: "0x1234567890123456789012345678901234567890",
                    protocol_name: "Unknown DeFi Protocol",
                    risk_score: 0.82,
                    risk_level: "HIGH",
                    recommendation: "BLOCKED_HIGH_RISK"
                }
            ],
            flagged_transactions: [
                {
                    transaction_hash: "0xabc123def456...",
                    aml_risk_score: 0.85,
                    compliance_level: "REQUIRES_REVIEW",
                    suspicious_patterns: ["LARGE_TRANSACTION", "HIGH_FREQUENCY"]
                }
            ],
            recommendations: [
                "REDUCE_HIGH_RISK_PROTOCOL_EXPOSURE",
                "IMPLEMENT_ENHANCED_TRANSACTION_MONITORING",
                "CURRENT_COMPLIANCE_ADEQUATE_FOR_LOW_RISK_PROTOCOLS"
            ],
            report_timestamp: new Date().toISOString()
        };
        res.json({
            success: true,
            report: complianceReport,
            demo_mode: true
        });
    }
    catch (error) {
        console.error('Demo report generation error:', error);
        res.status(500).json({
            error: 'Failed to generate compliance report',
            message: 'Demo service error'
        });
    }
});
export default router;
//# sourceMappingURL=compliance-demo.js.map