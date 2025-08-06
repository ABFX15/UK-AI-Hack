/**
 * Helper utility functions
 * TODO: Implement utility functions for common tasks
 */
/**
 * Generate unique identifiers
 */
export const generateId = (prefix) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
};
/**
 * Sleep/delay function
 */
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
/**
 * Retry function with exponential backoff
 * TODO: Implement retry logic
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
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
            await sleep(delay);
        }
    }
    throw lastError;
};
/**
 * Format currency values
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
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
/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength - 3) + '...';
};
/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
    if (total === 0)
        return 0;
    return Math.round((value / total) * 100);
};
/**
 * Generate random color (for avatars, charts, etc.)
 */
export const generateRandomColor = () => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)] || '#4ECDC4';
};
/**
 * Validate and format TRON address
 */
export const formatTronAddress = (address) => {
    // TODO: Implement TRON address validation and formatting
    return address;
};
/**
 * Extract domain from URL
 */
export const extractDomain = (url) => {
    try {
        return new URL(url).hostname;
    }
    catch {
        return url;
    }
};
/**
 * Generate slug from text
 */
export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
/**
 * Deep clone object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array)
        return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
};
/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
    if (obj == null)
        return true;
    if (typeof obj === 'string' || Array.isArray(obj))
        return obj.length === 0;
    if (typeof obj === 'object')
        return Object.keys(obj).length === 0;
    return false;
};
/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
/**
 * Convert camelCase to Title Case
 */
export const camelToTitle = (str) => {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, char => char.toUpperCase())
        .trim();
};
/**
 * Calculate reading time for text
 */
export const calculateReadingTime = (text, wordsPerMinute = 200) => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};
/**
 * Generate secure random string
 */
export const generateSecureToken = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
/**
 * Parse query string parameters
 */
export const parseQueryString = (queryString) => {
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
/**
 * Rate limiting helper
 */
export const isWithinRateLimit = (requestTimestamps, maxRequests, windowMs) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    const validRequests = requestTimestamps.filter(timestamp => timestamp > windowStart);
    return validRequests.length < maxRequests;
};
//# sourceMappingURL=helpers.js.map