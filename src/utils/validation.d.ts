/**
 * Validation Schemas for API Endpoints
 * TODO: Implement comprehensive validation schemas
 */
export declare const validationSchemas: {
    userRegistration: {
        required: string[];
        optional: string[];
        rules: {
            email: string;
            password: string;
            username: string;
        };
    };
    userLogin: {
        required: string[];
        rules: {
            email: string;
            password: string;
        };
    };
    walletAuth: {
        required: string[];
        rules: {
            walletAddress: string;
        };
    };
    developerProfile: {
        required: string[];
        optional: string[];
        rules: {
            githubUsername: string;
            expectedSalary: string;
            yearsOfExperience: string;
        };
    };
    companyProfile: {
        required: string[];
        optional: string[];
        rules: {
            companyName: string;
            website: string;
            employeeCount: string;
        };
    };
    jobPosting: {
        required: string[];
        optional: string[];
        rules: {
            title: string;
            description: string;
            experienceLevel: string;
            salaryMin: string;
            salaryMax: string;
        };
    };
    jobApplication: {
        required: string[];
        optional: string[];
        rules: {
            coverLetter: string;
        };
    };
    candidateFeedback: {
        required: string[];
        optional: string[];
        rules: {
            rating: string;
            recommend: string;
        };
    };
    skillsUpdate: {
        required: string[];
        rules: {
            skills: string;
            'skills.*.name': string;
            'skills.*.proficiency': string;
        };
    };
    reputationUpdate: {
        required: string[];
        optional: string[];
        rules: {
            userAddress: string;
            newScore: string;
        };
    };
    escrowCreation: {
        required: string[];
        rules: {
            amount: string;
            recruiterAddress: string;
            candidateAddress: string;
        };
    };
};
/**
 * Custom validation rules
 * TODO: Implement custom validation functions
 */
export declare const customValidators: {
    email: (value: string) => boolean;
    url: (value: string) => boolean;
    tron_address: (value: string) => boolean;
    github_username: (value: string) => boolean;
    wallet_signature: (value: string) => boolean;
};
/**
 * Sanitization functions
 * TODO: Implement data sanitization
 */
export declare const sanitizers: {
    trimString: (value: string) => string;
    toLowerCase: (value: string) => string;
    removeHtml: (value: string) => string;
    normalizeEmail: (value: string) => string;
    sanitizeGithubUsername: (value: string) => string;
};
/**
 * Error messages
 * TODO: Implement comprehensive error messages
 */
export declare const errorMessages: {
    required: (field: string) => string;
    email: string;
    min: (field: string, min: number) => string;
    max: (field: string, max: number) => string;
    number: (field: string) => string;
    boolean: (field: string) => string;
    url: string;
    tron_address: string;
    github_username: string;
    in: (field: string, options: string[]) => string;
};
//# sourceMappingURL=validation.d.ts.map