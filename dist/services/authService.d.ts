export interface AuthRequest {
    user?: {
        id: string;
        email: string;
        role: string;
        walletAddress?: string;
    };
}
export declare class AuthService {
    private prisma;
    constructor();
    /**
     * Register new user
     * TODO: Implement user registration
     */
    register(userData: any): Promise<any>;
    /**
     * Login user
     * TODO: Implement user login
     */
    login(credentials: any): Promise<any>;
    /**
     * Wallet-based authentication
     * TODO: Implement Web3 wallet authentication
     */
    authenticateWallet(walletAddress: string, signature: string, message: string): Promise<any>;
    /**
     * Verify JWT token
     * TODO: Implement token verification
     */
    verifyToken(token: string): Promise<any>;
    /**
     * Refresh access token
     * TODO: Implement token refresh
     */
    refreshToken(refreshToken: string): Promise<any>;
    /**
     * Logout user
     * TODO: Implement logout
     */
    logout(token: string): Promise<void>;
    /**
     * Reset password
     * TODO: Implement password reset
     */
    resetPassword(email: string): Promise<boolean>;
    /**
     * Change password
     * TODO: Implement password change
     */
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean>;
    /**
     * Get user profile
     * TODO: Implement profile retrieval
     */
    getUserProfile(userId: string): Promise<any>;
    /**
     * Update user profile
     * TODO: Implement profile update
     */
    updateUserProfile(userId: string, updates: any): Promise<any>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map