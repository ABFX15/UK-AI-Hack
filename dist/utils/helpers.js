"use strict";
/**
 * Helper utility functions
 * TODO: Implement utility functions for common tasks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWithinRateLimit = exports.parseQueryString = exports.generateSecureToken = exports.calculateReadingTime = exports.camelToTitle = exports.capitalize = exports.isEmpty = exports.deepClone = exports.generateSlug = exports.extractDomain = exports.formatTronAddress = exports.generateRandomColor = exports.calculatePercentage = exports.truncateText = exports.formatRelativeTime = exports.formatCurrency = exports.retryWithBackoff = exports.sleep = exports.generateId = void 0;
/**
 * Generate unique identifiers
 */
const generateId = (prefix) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
};
exports.generateId = generateId;
/**
 * Sleep/delay function
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
/**
 * Retry function with exponential backoff
 * TODO: Implement retry logic
 */
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries) {
                throw lastError;
            }
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
            await (0, exports.sleep)(delay);
        }
    }
    throw lastError;
};
exports.retryWithBackoff = retryWithBackoff;
/**
 * Format currency values
 */
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
/**
 * Format relative time (e.g., "2 hours ago")
 */
const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    else if (diffHours > 0) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    else {
        return 'Just now';
    }
};
exports.formatRelativeTime = formatRelativeTime;
/**
 * Truncate text with ellipsis
 */
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength - 3) + '...';
};
exports.truncateText = truncateText;
/**
 * Calculate percentage
 */
const calculatePercentage = (value, total) => {
    if (total === 0)
        return 0;
    return Math.round((value / total) * 100);
};
exports.calculatePercentage = calculatePercentage;
/**
 * Generate random color (for avatars, charts, etc.)
 */
const generateRandomColor = () => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)] || '#4ECDC4';
};
exports.generateRandomColor = generateRandomColor;
/**
 * Validate and format TRON address
 */
const formatTronAddress = (address) => {
    // TODO: Implement TRON address validation and formatting
    return address;
};
exports.formatTronAddress = formatTronAddress;
/**
 * Extract domain from URL
 */
const extractDomain = (url) => {
    try {
        return new URL(url).hostname;
    }
    catch {
        return url;
    }
};
exports.extractDomain = extractDomain;
/**
 * Generate slug from text
 */
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.generateSlug = generateSlug;
/**
 * Deep clone object
 */
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array)
        return obj.map(item => (0, exports.deepClone)(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = (0, exports.deepClone)(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
};
exports.deepClone = deepClone;
/**
 * Check if object is empty
 */
const isEmpty = (obj) => {
    if (obj == null)
        return true;
    if (typeof obj === 'string' || Array.isArray(obj))
        return obj.length === 0;
    if (typeof obj === 'object')
        return Object.keys(obj).length === 0;
    return false;
};
exports.isEmpty = isEmpty;
/**
 * Capitalize first letter
 */
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
exports.capitalize = capitalize;
/**
 * Convert camelCase to Title Case
 */
const camelToTitle = (str) => {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, char => char.toUpperCase())
        .trim();
};
exports.camelToTitle = camelToTitle;
/**
 * Calculate reading time for text
 */
const calculateReadingTime = (text, wordsPerMinute = 200) => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};
exports.calculateReadingTime = calculateReadingTime;
/**
 * Generate secure random string
 */
const generateSecureToken = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateSecureToken = generateSecureToken;
/**
 * Parse query string parameters
 */
const parseQueryString = (queryString) => {
    const params = {};
    if (queryString.startsWith('?'))
        queryString = queryString.slice(1);
    queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    });
    return params;
};
exports.parseQueryString = parseQueryString;
/**
 * Rate limiting helper
 */
const isWithinRateLimit = (requestTimestamps, maxRequests, windowMs) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    const validRequests = requestTimestamps.filter(timestamp => timestamp > windowStart);
    return validRequests.length < maxRequests;
};
exports.isWithinRateLimit = isWithinRateLimit;
//# sourceMappingURL=helpers.js.map