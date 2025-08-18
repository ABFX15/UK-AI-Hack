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
const compliance_demo_js_1 = __importDefault(require("./routes/compliance-demo.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
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
        }
    });
});
// Routes
app.use('/api/compliance', compliance_demo_js_1.default);
app.use('/api/auth', auth_js_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `The endpoint ${req.originalUrl} does not exist`
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🏛️ DeFi Regulatory Compliance Platform`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🤖 AI Service: ${process.env.AI_SERVICE_URL || 'http://localhost:8001'}`);
    console.log(`🔗 Smart Contracts: Circle Layer Testnet`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map