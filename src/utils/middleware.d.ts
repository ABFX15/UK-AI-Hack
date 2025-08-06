/**
 * JWT Authentication Middleware
 * TODO: Implement JWT token verification
 */
export declare const authenticateToken: (req: any, res: any, next: any) => Promise<any>;
/**
 * Role-based Authorization Middleware
 * TODO: Implement role checking
 */
export declare const requireRole: (allowedRoles: string[]) => (req: any, res: any, next: any) => any;
/**
 * Rate Limiting Middleware
 * TODO: Implement rate limiting
 */
export declare const rateLimiter: (maxRequests: number, windowMs: number) => (req: any, res: any, next: any) => any;
/**
 * Input Validation Middleware
 * TODO: Implement comprehensive validation
 */
export declare const validateInput: (schema: any) => (req: any, res: any, next: any) => any;
/**
 * CORS Configuration
 * TODO: Configure CORS for production
 */
export declare const corsOptions: {
    origin: string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
};
/**
 * Error Handler Middleware
 * TODO: Implement comprehensive error handling
 */
export declare const errorHandler: (error: any, req: any, res: any, next: any) => any;
/**
 * Logging Middleware
 * TODO: Implement structured logging
 */
export declare const requestLogger: (req: any, res: any, next: any) => void;
//# sourceMappingURL=middleware.d.ts.map