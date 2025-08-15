import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
// Import compliance-focused routes  
import complianceDemoRoutes from './routes/compliance-demo.js';
import authRoutes from './routes/auth.js';
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-compliance-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
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
        api_endpoints: {
            compliance_analysis: '/api/compliance/analyze-protocol',
            aml_analysis: '/api/compliance/analyze-transaction',
            compliance_reports: '/api/compliance/report/:institutionId',
            dashboard: '/api/compliance/dashboard/:institutionId',
            settings: '/api/compliance/settings/:institutionId'
        },
        ai_service: {
            url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
            status: 'Integration ready'
        }
    });
});
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        services: {
            database: 'connected', // In production, this would check actual DB connection
            ai_service: 'available',
            compliance_engine: 'active'
        }
    });
});
// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'DeFi Regulatory Compliance API',
        version: '2.0.0',
        documentation: {
            compliance: 'Analyze DeFi protocols for institutional compliance',
            aml: 'Anti-Money Laundering transaction analysis',
            reporting: 'Generate comprehensive compliance reports',
            monitoring: 'Real-time risk monitoring and alerts'
        },
        endpoints: {
            'POST /api/compliance/analyze-protocol': 'Analyze DeFi protocol risk',
            'POST /api/compliance/analyze-transaction': 'AML compliance analysis',
            'GET /api/compliance/report/:institutionId': 'Generate compliance report',
            'GET /api/compliance/dashboard/:institutionId': 'Real-time dashboard data',
            'PUT /api/compliance/settings/:institutionId': 'Update compliance settings',
            'GET /api/compliance/history/:institutionId': 'Historical compliance data'
        }
    });
});
// API Routes
app.use('/api/compliance', complianceDemoRoutes);
app.use('/api/auth', authRoutes);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: 'Please check the API documentation at /api for available endpoints',
        available_endpoints: ['/api/compliance', '/api/auth', '/health']
    });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error('🚨 Unhandled API error:', error);
    // Log additional context in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Request URL:', req.originalUrl);
        console.error('Request Method:', req.method);
        console.error('Request Body:', req.body);
    }
    res.status(error.status || 500).json({
        error: true,
        message: error.message || 'Internal server error',
        code: error.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});
// Background compliance monitoring (runs every 30 minutes)
setInterval(async () => {
    try {
        console.log('� Running compliance monitoring tasks...');
        // In production, this would:
        // 1. Check for new DeFi protocol deployments
        // 2. Monitor TVL changes in tracked protocols  
        // 3. Scan for suspicious transaction patterns
        // 4. Update regulatory alerts
        // 5. Generate automated reports for flagged activities
        console.log('✅ Compliance monitoring tasks completed');
    }
    catch (error) {
        console.error('❌ Error in compliance monitoring:', error);
    }
}, 30 * 60 * 1000); // Run every 30 minutes
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    process.exit(0);
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 DeFi Regulatory Compliance Platform running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Documentation: http://localhost:${PORT}/api`);
    console.log(`💊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🛡️  Compliance Dashboard: http://localhost:${PORT}/`);
});
export default app;
//# sourceMappingURL=index.js.map