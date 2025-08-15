export declare const config: {
    port: string | number;
    nodeEnv: string;
    database: {
        url: string;
    };
    aiService: {
        url: string;
        apiKey: string;
    };
    github: {
        token: string;
        clientId: string;
        clientSecret: string;
    };
    openai: {
        apiKey: string;
        model: string;
    };
    web3: {
        rpcUrl: string;
        privateKey: string;
        chainId: number;
        gasLimit: string;
        contracts: {
            reputationScore: string;
            slaEnforcement: string;
            talentMatching: string;
        };
        circle: {
            explorerUrl: string;
            apiUrl: string;
        };
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    email: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
    };
    redis: {
        url: string;
    };
    features: {
        enableWeb3: boolean;
        enableAI: boolean;
        enableRealTimeUpdates: boolean;
        enableSLAEnforcement: boolean;
    };
    cors: {
        origin: string;
        credentials: boolean;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
};
export declare function validateConfig(): boolean;
//# sourceMappingURL=config.d.ts.map