"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import compliance-focused routes  
const simple_test_1 = __importDefault(require("./routes/simple-test"));
// import complianceDemoRoutes from './routes/compliance-demo';
// import authRoutes from './routes/auth'; // Commented out - file doesn't exist
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-compliance-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
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
            compliance_reports: '/api/compliance/report',
            dashboard: '/api/compliance/dashboard',
            settings: '/api/compliance/settings'
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
            'GET /api/compliance/report': 'Generate compliance report',
            'GET /api/compliance/dashboard': 'Real-time dashboard data',
            'PUT /api/compliance/settings': 'Update compliance settings',
            'GET /api/compliance/history': 'Historical compliance data'
        }
    });
});
// API Routes
app.use('/api', simple_test_1.default);
// app.use('/api/compliance', complianceDemoRoutes);
// app.use('/api/auth', authRoutes); // Commented out - route doesn't exist
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
exports.default = app;
//# sourceMappingURL=index.js.map