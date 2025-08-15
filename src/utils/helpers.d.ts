/**
 * Helper utility functions
 * TODO: Implement utility functions for common tasks
 */
/**
 * Generate unique identifiers
 */
export declare const generateId: (prefix?: string) => string;
/**
 * Sleep/delay function
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * Retry function with exponential backoff
 * TODO: Implement retry logic
 */
export declare const retryWithBackoff: <T>(fn: () => Promise<T>, maxRetries?: number, baseDelay?: number) => Promise<T>;
/**
 * Format currency values
 */
export declare const formatCurrency: (amount: number, currency?: string) => string;
/**
 * Format relative time (e.g., "2 hours ago")
 */
export declare const formatRelativeTime: (date: Date) => string;
/**
 * Truncate text with ellipsis
 */
export declare const truncateText: (text: string, maxLength: number) => string;
/**
 * Calculate percentage
 */
export declare const calculatePercentage: (value: number, total: number) => number;
/**
 * Generate random color (for avatars, charts, etc.)
 */
export declare const generateRandomColor: () => string;
/**
 * Validate and format TRON address
 */
export declare const formatTronAddress: (address: string) => string;
/**
 * Extract domain from URL
 */
export declare const extractDomain: (url: string) => string;
/**
 * Generate slug from text
 */
export declare const generateSlug: (text: string) => string;
/**
 * Deep clone object
 */
export declare const deepClone: <T>(obj: T) => T;
/**
 * Check if object is empty
 */
export declare const isEmpty: (obj: any) => boolean;
/**
 * Capitalize first letter
 */
export declare const capitalize: (str: string) => string;
/**
 * Convert camelCase to Title Case
 */
export declare const camelToTitle: (str: string) => string;
/**
 * Calculate reading time for text
 */
export declare const calculateReadingTime: (text: string, wordsPerMinute?: number) => number;
/**
 * Generate secure random string
 */
export declare const generateSecureToken: (length?: number) => string;
/**
 * Parse query string parameters
 */
export declare const parseQueryString: (queryString: string) => Record<string, string>;
/**
 * Rate limiting helper
 */
export declare const isWithinRateLimit: (requestTimestamps: number[], maxRequests: number, windowMs: number) => boolean;
//# sourceMappingURL=helpers.d.ts.map