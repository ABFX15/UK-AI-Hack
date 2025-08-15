"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.errorHandler = exports.corsOptions = exports.validateInput = exports.rateLimiter = exports.requireRole = exports.authenticateToken = void 0;
const authService_js_1 = require("../services/authService.js");
/**
 * JWT Authentication Middleware
 * TODO: Implement JWT token verification
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        // TODO: Implement token verification
        const user = await authService_js_1.authService.verifyToken(token);
        if (!user) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(403).json({ error: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Role-based Authorization Middleware
 * TODO: Implement role checking
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            next();
        }
        catch (error) {
            console.error('Error in authorization middleware:', error);
            res.status(403).json({ error: 'Access denied' });
        }
    };
};
exports.requireRole = requireRole;
/**
 * Rate Limiting Middleware
 * TODO: Implement rate limiting
 */
const rateLimiter = (maxRequests, windowMs) => {
    const requests = new Map();
    return (req, res, next) => {
        try {
            const clientIp = req.ip || req.connection.remoteAddress;
            const now = Date.now();
            const windowStart = now - windowMs;
            // TODO: Implement proper rate limiting with Redis
            // For now, use in-memory tracking (not suitable for production)
            if (!requests.has(clientIp)) {
                requests.set(clientIp, []);
            }
            const clientRequests = requests.get(clientIp);
            const validRequests = clientRequests.filter((timestamp) => timestamp > windowStart);
            if (validRequests.length >= maxRequests) {
                return res.status(429).json({
                    error: 'Too many requests',
                    message: `Rate limit exceeded. Try again in ${Math.ceil(windowMs / 1000)} seconds.`
                });
            }
            validRequests.push(now);
            requests.set(clientIp, validRequests);
            next();
        }
        catch (error) {
            console.error('Error in rate limiter:', error);
            next(); // Allow request to continue on error
        }
    };
};
exports.rateLimiter = rateLimiter;
/**
 * Input Validation Middleware
 * TODO: Implement comprehensive validation
 */
const validateInput = (schema) => {
    return (req, res, next) => {
        try {
            // TODO: Use a validation library like Joi or Zod
            // For now, just check required fields exist
            const errors = [];
            if (schema.required) {
                for (const field of schema.required) {
                    if (!req.body[field]) {
                        errors.push(`${field} is required`);
                    }
                }
            }
            if (errors.length > 0) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors
                });
            }
            next();
        }
        catch (error) {
            console.error('Error in validation middleware:', error);
            res.status(400).json({ error: 'Invalid input data' });
        }
    };
};
exports.validateInput = validateInput;
/**
 * CORS Configuration
 * TODO: Configure CORS for production
 */
exports.corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
/**
 * Error Handler Middleware
 * TODO: Implement comprehensive error handling
 */
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    // Handle different types of errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: error.details
        });
    }
    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: error.message
        });
    }
    if (error.code === 'P2002') { // Prisma unique constraint error
        return res.status(409).json({
            error: 'Conflict',
            message: 'Resource already exists'
        });
    }
    // Default error response
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
};
exports.errorHandler = errorHandler;
/**
 * Logging Middleware
 * TODO: Implement structured logging
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
        // TODO: Add structured logging with Winston or similar
        // Log to external service like DataDog, CloudWatch, etc.
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=middleware.js.map