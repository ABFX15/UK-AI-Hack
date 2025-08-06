import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
// Import routes
import authRoutes from './routes/auth.js';
import developerRoutes from './routes/developers.js';
import companyRoutes from './routes/companies.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import tronRoutes from './routes/tron.js';
// Import services
import { antiGhostingService } from './services/antiGhostingService.js';
import { notificationService } from './services/notificationService.js';
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Web3 Talent Agent API',
        version: '1.0.0',
        status: 'running',
        features: [
            'AI-powered talent matching',
            'Anti-ghosting system',
            'Real-time application tracking',
            'Company reputation scores',
            'TRON blockchain integration',
            'GitHub profile analysis',
            'Automated communication'
        ],
        endpoints: {
            auth: '/api/auth',
            developers: '/api/developers',
            companies: '/api/companies',
            jobs: '/api/jobs',
            applications: '/api/applications',
            tron: '/api/tron'
        }
    });
});
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/tron', tronRoutes);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: 'Please check the API documentation for available endpoints'
    });
});
// Error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
// Background tasks - runs every hour
setInterval(async () => {
    try {
        console.log('🔄 Running background tasks...');
        await antiGhostingService.processOverdueApplications();
        await notificationService.processPendingNotifications();
        await notificationService.sendCompanyReminders();
        console.log('✅ Background tasks completed');
    }
    catch (error) {
        console.error('❌ Error in background tasks:', error);
    }
}, 60 * 60 * 1000); // Run every hour
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Web3 Talent Agent server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
export default app;
//# sourceMappingURL=index.js.map