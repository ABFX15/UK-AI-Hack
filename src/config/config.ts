export const config = {
    // Server Configuration
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database Configuration
    database: {
        url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/web3_talent_agent',
    },

    // AI/ML Service Configuration
    aiService: {
        url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
        apiKey: process.env.AI_SERVICE_API_KEY || '',
    },

    // External APIs
    github: {
        token: process.env.GITHUB_TOKEN || '',
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },

    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-4',
    },

    // Web3 Configuration
    web3: {
        rpcUrl: process.env.WEB3_RPC_URL || process.env.CIRCLE_RPC_URL || 'https://rpc.circle.network',
        privateKey: process.env.PRIVATE_KEY || '',
        chainId: parseInt(process.env.CHAIN_ID || '8453'),
        gasLimit: process.env.GAS_LIMIT || '500000',

        // Contract Addresses (update after deployment)
        contracts: {
            reputationScore: process.env.REPUTATION_CONTRACT_ADDRESS || '',
            slaEnforcement: process.env.SLA_CONTRACT_ADDRESS || '',
            talentMatching: process.env.MATCHING_CONTRACT_ADDRESS || '',
        },

        // Circle-specific settings
        circle: {
            explorerUrl: process.env.CIRCLE_EXPLORER_URL || 'https://explorer.circle.network',
            apiUrl: process.env.CIRCLE_API_URL || 'https://api.circle.network',
        }
    },

    // Authentication
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },

    // Email Configuration
    email: {
        host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@web3talentagent.com',
    },

    // Redis Configuration (for caching and sessions)
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },

    // Feature Flags
    features: {
        enableWeb3: process.env.ENABLE_WEB3 === 'true',
        enableAI: process.env.ENABLE_AI === 'true',
        enableRealTimeUpdates: process.env.ENABLE_REALTIME === 'true',
        enableSLAEnforcement: process.env.ENABLE_SLA === 'true',
    },

    // Security
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
        credentials: true,
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    },
};

// Validation
export function validateConfig() {
    const required = [
        'DATABASE_URL',
        'WEB3_RPC_URL',
        'PRIVATE_KEY',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.warn(`Missing environment variables: ${missing.join(', ')}`);
        console.warn('Some features may not work correctly.');
    }

    if (config.features.enableWeb3 && !config.web3.privateKey) {
        console.error('Web3 is enabled but PRIVATE_KEY is not set');
        process.exit(1);
    }

    return true;
}
