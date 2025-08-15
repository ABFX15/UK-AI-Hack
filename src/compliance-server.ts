import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-compliance-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint - DeFi Compliance Platform
app.get('/', (req, res) => {
    res.json({
        name: 'DeFi Regulatory Compliance Platform',
        version: '2.0.0',
        description: 'AI-powered compliance monitoring for financial institutions using DeFi protocols',
        capabilities: [
            'Real-time DeFi protocol risk assessment',
            'AI-powered AML transaction analysis', 
            'Automated regulatory compliance reporting',
            'Smart contract security auditing',
            'Cross-jurisdictional compliance monitoring',
            'Regulatory alert system'
        ],
        endpoints: {
            health: '/health',
            analyze_protocol: '/api/compliance/analyze-protocol',
            analyze_transaction: '/api/compliance/analyze-transaction',
            dashboard: '/api/compliance/dashboard',
            reports: '/api/compliance/reports'
        },
        status: 'operational'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        services: {
            api: 'running',
            database: 'available',
            ai_service: process.env.AI_SERVICE_URL ? 'configured' : 'not_configured'
        }
    });
});

// Protocol Analysis Endpoint
app.post('/api/compliance/analyze-protocol', async (req, res) => {
    try {
        const { protocol_address, institution_id } = req.body;
        
        if (!protocol_address) {
            return res.status(400).json({
                error: 'protocol_address is required'
            });
        }

        // Demo protocol analysis (in production, this would call AI service)
        const mockAnalysis = {
            protocol_address,
            protocol_name: getProtocolName(protocol_address),
            risk_score: Math.random() * 0.5 + 0.1, // 0.1 to 0.6
            risk_level: 'LOW',
            recommendation: 'APPROVED_FOR_INSTITUTIONAL_USE',
            max_exposure_percentage: 25.0,
            compliance_status: {
                SEC: 'COMPLIANT',
                FCA: 'COMPLIANT',
                MiCA: 'COMPLIANT'
            },
            risk_factors: {
                smart_contract_risk: Math.random() * 0.3,
                liquidity_risk: Math.random() * 0.4,
                governance_risk: Math.random() * 0.3
            },
            audit_status: 'AUDITED',
            confidence_score: 0.92,
            analysis_timestamp: new Date().toISOString()
        };

        res.json({
            success: true,
            analysis: mockAnalysis,
            institution_id
        });

    } catch (error) {
        console.error('Protocol analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze protocol',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Transaction Analysis Endpoint  
app.post('/api/compliance/analyze-transaction', async (req, res) => {
    try {
        const { transaction_hash, amount_usd, counterparty_address } = req.body;
        
        if (!transaction_hash) {
            return res.status(400).json({
                error: 'transaction_hash is required'
            });
        }

        // Demo AML analysis
        const mockAnalysis = {
            transaction_hash,
            aml_risk_score: Math.random() * 0.3, // Low risk for demo
            compliance_level: 'COMPLIANT',
            suspicious_patterns: [],
            sanctions_check: 'CLEAR',
            requires_manual_review: false,
            analysis_timestamp: new Date().toISOString()
        };

        res.json({
            success: true,
            analysis: mockAnalysis
        });

    } catch (error) {
        console.error('Transaction analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze transaction',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Dashboard endpoint
app.get('/api/compliance/dashboard', (req, res) => {
    const institutionId = req.query.institutionId || 'demo_institution';
    
    const mockDashboard = {
        institution_id: institutionId,
        overall_compliance_score: 94.2,
        protocols_monitored: 15,
        transactions_analyzed_today: 847,
        active_alerts: 2,
        recent_analyses: [
            {
                protocol: 'Aave V2',
                risk_score: 0.23,
                status: 'APPROVED',
                timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
                protocol: 'Compound V3', 
                risk_score: 0.18,
                status: 'APPROVED',
                timestamp: new Date(Date.now() - 7200000).toISOString()
            }
        ]
    };
    
    res.json(mockDashboard);
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', error);
    res.status(error.status || 500).json({
        error: true,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: true,
        message: `Route ${req.originalUrl} not found`,
        available_endpoints: ['/', '/health', '/api/compliance/analyze-protocol', '/api/compliance/analyze-transaction']
    });
});

// Helper function
function getProtocolName(address: string): string {
    const protocolMap: Record<string, string> = {
        '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9': 'Aave V2',
        '0x3d9819210a31b4961b30ef98c06e29e99caddc88': 'Compound V2',
        '0xc00e94cb662c3520282e6f5717214004a7f26888': 'Compound V3'
    };
    
    return protocolMap[address.toLowerCase()] || `Protocol ${address.substring(0, 8)}...`;
}

app.listen(PORT, () => {
    console.log(`🚀 DeFi Compliance Platform running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Documentation: http://localhost:${PORT}/`);
    console.log(`💊 Health Check: http://localhost:${PORT}/health`);
    
    if (process.env.AI_SERVICE_URL) {
        console.log(`🤖 AI Service: ${process.env.AI_SERVICE_URL}`);
    } else {
        console.log(`⚠️  AI Service URL not configured`);
    }
});

export default app;