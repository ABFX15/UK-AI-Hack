"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const prisma_1 = require("../generated/prisma");
// Import routes
const compliance_1 = __importDefault(require("./routes/compliance"));
const app = (0, express_1.default)();
const prisma = new prisma_1.PrismaClient();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001']
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'DeFi Regulatory Compliance Platform'
    });
});
// API Routes
app.use('/api/compliance', compliance_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: true,
        message: `Route ${req.originalUrl} not found`
    });
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});
app.listen(PORT, () => {
    console.log(`🚀 DeFi Compliance API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 API docs: http://localhost:${PORT}/api/compliance`);
});
exports.default = app;
//# sourceMappingURL=server.js.map