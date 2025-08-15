/**
 * Compliance Validation Rules
 * Validation rules for DeFi regulatory compliance platform
 */
export interface ValidationRules {
    required?: string[];
    optional?: string[];
    types?: Record<string, string>;
    rules?: Record<string, string>;
}
export declare const validationRules: Record<string, ValidationRules>;
/**
 * Validate data against defined rules
 */
export declare const validate: (data: any, ruleName: string) => {
    valid: boolean;
    errors: string[];
};
/**
 * Helper validation functions
 */
declare const isValidEthereumAddress: (address: string) => boolean;
declare const isValidEmail: (email: string) => boolean;
export { isValidEthereumAddress, isValidEmail };
//# sourceMappingURL=compliance-validation.d.ts.map