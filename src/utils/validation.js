/**
 * Validation Schemas for API Endpoints
 * TODO: Implement comprehensive validation schemas
 */
export const validationSchemas = {
    // User Registration
    userRegistration: {
        required: ['email', 'password', 'username'],
        optional: ['role'],
        rules: {
            email: 'email',
            password: 'min:8',
            username: 'min:3,max:50'
        }
    },
    // User Login
    userLogin: {
        required: ['email', 'password'],
        rules: {
            email: 'email',
            password: 'min:8'
        }
    },
    // Wallet Authentication
    walletAuth: {
        required: ['walletAddress', 'signature', 'message'],
        rules: {
            walletAddress: 'tron_address'
        }
    },
    // Developer Profile
    developerProfile: {
        required: ['githubUsername'],
        optional: ['bio', 'location', 'expectedSalary', 'yearsOfExperience'],
        rules: {
            githubUsername: 'min:1,max:39',
            expectedSalary: 'number,min:0',
            yearsOfExperience: 'number,min:0,max:50'
        }
    },
    // Company Profile
    companyProfile: {
        required: ['companyName'],
        optional: ['website', 'description', 'location', 'employeeCount'],
        rules: {
            companyName: 'min:2,max:100',
            website: 'url',
            employeeCount: 'in:1-10,11-50,51-200,201-500,500+'
        }
    },
    // Job Posting
    jobPosting: {
        required: ['title', 'description', 'experienceLevel'],
        optional: ['requirements', 'benefits', 'salaryMin', 'salaryMax', 'location', 'remote'],
        rules: {
            title: 'min:5,max:100',
            description: 'min:50,max:5000',
            experienceLevel: 'in:entry,mid,senior,lead',
            salaryMin: 'number,min:0',
            salaryMax: 'number,min:0'
        }
    },
    // Application
    jobApplication: {
        required: ['jobId', 'developerId'],
        optional: ['coverLetter'],
        rules: {
            coverLetter: 'max:2000'
        }
    },
    // Feedback
    candidateFeedback: {
        required: ['rating'],
        optional: ['feedback', 'recommend'],
        rules: {
            rating: 'number,min:1,max:5',
            recommend: 'boolean'
        }
    },
    // Skills Update
    skillsUpdate: {
        required: ['skills'],
        rules: {
            skills: 'array',
            'skills.*.name': 'required,min:2,max:50',
            'skills.*.proficiency': 'number,min:1,max:10'
        }
    },
    // TRON Reputation Update
    reputationUpdate: {
        required: ['userAddress', 'newScore'],
        optional: ['metadata'],
        rules: {
            userAddress: 'tron_address',
            newScore: 'number,min:0,max:100'
        }
    },
    // Escrow Creation
    escrowCreation: {
        required: ['amount', 'recruiterAddress', 'candidateAddress', 'jobId'],
        rules: {
            amount: 'number,min:0',
            recruiterAddress: 'tron_address',
            candidateAddress: 'tron_address'
        }
    }
};
/**
 * Custom validation rules
 * TODO: Implement custom validation functions
 */
export const customValidators = {
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    url: (value) => {
        try {
            new URL(value);
            return true;
        }
        catch {
            return false;
        }
    },
    tron_address: (value) => {
        // TRON addresses start with T and are 34 characters long
        return /^T[A-Za-z0-9]{33}$/.test(value);
    },
    github_username: (value) => {
        // GitHub username rules: 1-39 characters, alphanumeric and hyphens
        return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(value);
    },
    wallet_signature: (value) => {
        // Basic hex signature validation
        return /^0x[a-fA-F0-9]{128,132}$/.test(value);
    }
};
/**
 * Sanitization functions
 * TODO: Implement data sanitization
 */
export const sanitizers = {
    trimString: (value) => {
        return typeof value === 'string' ? value.trim() : value;
    },
    toLowerCase: (value) => {
        return typeof value === 'string' ? value.toLowerCase() : value;
    },
    removeHtml: (value) => {
        return typeof value === 'string' ? value.replace(/<[^>]*>/g, '') : value;
    },
    normalizeEmail: (value) => {
        return typeof value === 'string' ? value.toLowerCase().trim() : value;
    },
    sanitizeGithubUsername: (value) => {
        return typeof value === 'string' ? value.toLowerCase().trim() : value;
    }
};
/**
 * Error messages
 * TODO: Implement comprehensive error messages
 */
export const errorMessages = {
    required: (field) => `${field} is required`,
    email: 'Please provide a valid email address',
    min: (field, min) => `${field} must be at least ${min} characters`,
    max: (field, max) => `${field} must not exceed ${max} characters`,
    number: (field) => `${field} must be a valid number`,
    boolean: (field) => `${field} must be true or false`,
    url: 'Please provide a valid URL',
    tron_address: 'Please provide a valid TRON address',
    github_username: 'Please provide a valid GitHub username',
    in: (field, options) => `${field} must be one of: ${options.join(', ')}`
};
//# sourceMappingURL=validation.js.map