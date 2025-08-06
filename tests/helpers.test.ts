import { describe, it, expect } from '@jest/globals';
import { generateId, formatCurrency, calculatePercentage } from '../src/utils/helpers.js';

describe('Helper Functions', () => {
    it('should generate unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
    });

    it('should generate IDs with prefix', () => {
        const id = generateId('test');
        expect(id).toMatch(/^test_/);
    });

    it('should format currency correctly', () => {
        expect(formatCurrency(50000)).toBe('$50,000');
        expect(formatCurrency(1500.99)).toBe('$1,501');
    });

    it('should calculate percentage correctly', () => {
        expect(calculatePercentage(25, 100)).toBe(25);
        expect(calculatePercentage(1, 3)).toBe(33);
        expect(calculatePercentage(0, 100)).toBe(0);
        expect(calculatePercentage(10, 0)).toBe(0);
    });
});

// TODO: Add more comprehensive tests
// - Test all services with mock data
// - Test API endpoints with supertest
// - Test database operations with test database
// - Test TRON integration with testnet
// - Test AI matching algorithms
// - Test anti-ghosting system
