import express from 'express';
import { authService } from '../services/authService.js';
const router = express.Router();
/**
 * Register new user
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, role } = req.body;
        // TODO: Add input validation
        // TODO: Check if user already exists
        const user = await authService.register({
            email,
            password,
            username,
            role: role || 'DEVELOPER'
        });
        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // TODO: Add input validation
        const result = await authService.login({ email, password });
        res.json(result);
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
/**
 * Wallet authentication
 * POST /api/auth/wallet
 */
router.post('/wallet', async (req, res) => {
    try {
        const { walletAddress, signature, message } = req.body;
        // TODO: Add input validation
        // TODO: Verify wallet signature
        const result = await authService.authenticateWallet(walletAddress, signature, message);
        res.json(result);
    }
    catch (error) {
        console.error('Error authenticating wallet:', error);
        res.status(401).json({ error: 'Invalid wallet signature' });
    }
});
/**
 * Refresh access token
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        // TODO: Add input validation
        const result = await authService.refreshToken(refreshToken);
        res.json(result);
    }
    catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});
/**
 * Logout user
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            await authService.logout(token);
        }
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Reset password
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        // TODO: Add input validation
        const success = await authService.resetPassword(email);
        res.json({
            message: success ? 'Reset email sent' : 'Email not found',
            success
        });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Change password
 * PUT /api/auth/change-password
 */
router.put('/change-password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        // TODO: Get userId from JWT token
        const userId = 'temp-user-id';
        // TODO: Add input validation
        const success = await authService.changePassword(userId, oldPassword, newPassword);
        res.json({
            message: success ? 'Password changed successfully' : 'Invalid old password',
            success
        });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Get current user profile
 * GET /api/auth/profile
 */
router.get('/profile', async (req, res) => {
    try {
        // TODO: Get userId from JWT token
        const userId = 'temp-user-id';
        const profile = await authService.getUserProfile(userId);
        res.json(profile);
    }
    catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Update user profile
 * PUT /api/auth/profile
 */
router.put('/profile', async (req, res) => {
    try {
        const updates = req.body;
        // TODO: Get userId from JWT token
        const userId = 'temp-user-id';
        // TODO: Add input validation
        const updatedProfile = await authService.updateUserProfile(userId, updates);
        res.json(updatedProfile);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * Verify email address
 * GET /api/auth/verify/:token
 */
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        // TODO: Implement email verification
        // 1. Verify token
        // 2. Mark email as verified
        // 3. Update user status
        console.log(`✉️ Verifying email with token: ${token}`);
        res.json({ message: 'Email verification endpoint - TODO: Implement' });
    }
    catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=auth.js.map