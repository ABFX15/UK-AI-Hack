"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001']
}));
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
// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working' });
});
app.listen(PORT, () => {
    console.log(`🚀 DeFi Compliance API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=server-simple.js.map