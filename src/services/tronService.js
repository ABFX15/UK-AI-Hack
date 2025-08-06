// @ts-ignore
import TronWeb from 'tronweb';
export class TronService {
    tronWeb;
    constructor() {
        const network = process.env.TRON_NETWORK || 'shasta';
        const privateKey = process.env.TRON_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('TRON_PRIVATE_KEY is required');
        }
        // Configure for mainnet or testnet
        const fullHost = network === 'mainnet'
            ? 'https://api.trongrid.io'
            : 'https://api.shasta.trongrid.io';
        this.tronWeb = new TronWeb({
            fullHost,
            headers: { 'TRON-PRO-API-KEY': process.env.TRON_GRID_API_KEY },
            privateKey
        });
    }
    /**
     * Create a new wallet address
     */
    async createWallet() {
        const account = await this.tronWeb.createAccount();
        return {
            address: account.address.base58,
            privateKey: account.privateKey,
            publicKey: account.publicKey
        };
    }
    /**
     * Get account balance
     */
    async getBalance(address) {
        const balance = await this.tronWeb.trx.getBalance(address);
        return this.tronWeb.fromSun(balance);
    }
    /**
     * Update reputation score on-chain
     */
    async updateReputationScore(userAddress, newScore, metadata) {
        try {
            // In a real implementation, this would interact with a smart contract
            // For now, we'll create a transaction with the reputation data
            const transaction = await this.tronWeb.transactionBuilder.sendTrx(userAddress, 1000000, // 1 TRX minimum
            this.tronWeb.defaultAddress.base58);
            // Add metadata to transaction
            if (metadata) {
                transaction.raw_data.data = this.tronWeb.toHex(JSON.stringify({
                    type: 'REPUTATION_UPDATE',
                    score: newScore,
                    metadata,
                    timestamp: Date.now()
                }));
            }
            const signedTx = await this.tronWeb.trx.sign(transaction);
            const broadcast = await this.tronWeb.trx.sendRawTransaction(signedTx);
            return broadcast.txid;
        }
        catch (error) {
            console.error('Error updating reputation score:', error);
            throw error;
        }
    }
    /**
     * Verify a transaction exists on the blockchain
     */
    async verifyTransaction(txHash) {
        try {
            const transaction = await this.tronWeb.trx.getTransaction(txHash);
            return transaction;
        }
        catch (error) {
            console.error('Error verifying transaction:', error);
            return null;
        }
    }
    /**
     * Get reputation score from blockchain
     */
    async getReputationScore(userAddress) {
        // In a real implementation, this would query a smart contract
        // For now, we'll return a placeholder
        try {
            const transactions = await this.tronWeb.trx.getTransactionsFromAddress(userAddress, 50);
            // Calculate reputation based on transaction history and metadata
            let score = 0;
            for (const tx of transactions) {
                if (tx.raw_data?.data) {
                    try {
                        const data = JSON.parse(this.tronWeb.toAscii(tx.raw_data.data));
                        if (data.type === 'REPUTATION_UPDATE') {
                            score = Math.max(score, data.score);
                        }
                    }
                    catch (e) {
                        // Ignore invalid metadata
                    }
                }
            }
            return score;
        }
        catch (error) {
            console.error('Error getting reputation score:', error);
            return 0;
        }
    }
    /**
     * Create escrow transaction for payment
     */
    async createEscrow(amount, recruiterAddress, candidateAddress, jobId) {
        try {
            // Convert TRX to SUN
            const amountInSun = this.tronWeb.toSun(amount);
            const transaction = await this.tronWeb.transactionBuilder.sendTrx(recruiterAddress, amountInSun, this.tronWeb.defaultAddress.base58);
            // Add escrow metadata
            transaction.raw_data.data = this.tronWeb.toHex(JSON.stringify({
                type: 'ESCROW_PAYMENT',
                jobId,
                candidateAddress,
                amount,
                timestamp: Date.now()
            }));
            const signedTx = await this.tronWeb.trx.sign(transaction);
            const broadcast = await this.tronWeb.trx.sendRawTransaction(signedTx);
            return broadcast.txid;
        }
        catch (error) {
            console.error('Error creating escrow:', error);
            throw error;
        }
    }
}
export const tronService = new TronService();
//# sourceMappingURL=tronService.js.map