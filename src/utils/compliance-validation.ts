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

export const validationRules: Record<string, ValidationRules> = {
    // Institution Registration
    institutionRegistration: {
        required: ['name', 'email', 'institutionType', 'country'],
        optional: ['walletAddress', 'regulatoryId', 'riskTolerance'],
        types: {
            email: 'email',
            institutionType: 'string',
            country: 'string',
            walletAddress: 'ethereumAddress'
        },
        rules: {
            name: 'min:2,max:200',
            email: 'email',
            country: 'min:2,max:3'
        }
    },

    // Protocol Analysis Request
    protocolAnalysis: {
        required: ['protocol_address'],
        optional: ['institution_address'],
        types: {
            protocol_address: 'ethereumAddress',
            institution_address: 'ethereumAddress'
        },
        rules: {
            protocol_address: 'required,ethereumAddress',
            institution_address: 'ethereumAddress'
        }
    },

    // AML Transaction Analysis
    amlTransactionAnalysis: {
        required: ['tx_hash'],
        optional: ['amount_usd', 'counterparty_address', 'frequency_24h', 'origin_country'],
        types: {
            tx_hash: 'string',
            amount_usd: 'number',
            counterparty_address: 'ethereumAddress',
            frequency_24h: 'number',
            origin_country: 'string'
        },
        rules: {
            tx_hash: 'required,min:64,max:66',
            amount_usd: 'number,min:0',
            frequency_24h: 'number,min:0,max:1000'
        }
    },

    // Compliance Settings
    complianceSettings: {
        required: ['institutionId'],
        optional: ['risk_tolerance_level', 'max_exposure_percentage', 'enable_aml_monitoring', 'custom_risk_parameters'],
        types: {
            institutionId: 'string',
            risk_tolerance_level: 'string',
            max_exposure_percentage: 'number',
            enable_aml_monitoring: 'boolean'
        },
        rules: {
            max_exposure_percentage: 'number,min:0,max:100'
        }
    },

    // Smart Contract Interaction
    regulatoryOracleUpdate: {
        required: ['protocolAddress', 'complianceData'],
        optional: ['institutionAddress'],
        types: {
            protocolAddress: 'ethereumAddress',
            institutionAddress: 'ethereumAddress',
            complianceData: 'object'
        }
    }
};

/**
 * Validate data against defined rules
 */
export const validate = (data: any, ruleName: string): { valid: boolean; errors: string[] } => {
    const rules = validationRules[ruleName];
    if (!rules) {
        return { valid: false, errors: [`Unknown validation rule: ${ruleName}`] };
    }

    const errors: string[] = [];

    // Check required fields
    if (rules.required) {
        for (const field of rules.required) {
            if (!data[field]) {
                errors.push(`Required field missing: ${field}`);
            }
        }
    }

    // Type validation
    if (rules.types) {
        for (const [field, type] of Object.entries(rules.types)) {
            if (data[field] !== undefined) {
                if (type === 'ethereumAddress' && !isValidEthereumAddress(data[field])) {
                    errors.push(`Invalid Ethereum address: ${field}`);
                } else if (type === 'email' && !isValidEmail(data[field])) {
                    errors.push(`Invalid email: ${field}`);
                } else if (type === 'number' && typeof data[field] !== 'number') {
                    errors.push(`Field must be a number: ${field}`);
                }
            }
        }
    }

    return { valid: errors.length === 0, errors };
};

/**
 * Helper validation functions
 */
const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export { isValidEthereumAddress, isValidEmail };
