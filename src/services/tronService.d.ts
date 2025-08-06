export declare class TronService {
    private tronWeb;
    constructor();
    /**
     * Create a new wallet address
     */
    createWallet(): Promise<{
        address: any;
        privateKey: any;
        publicKey: any;
    }>;
    /**
     * Get account balance
     */
    getBalance(address: string): Promise<number>;
    /**
     * Update reputation score on-chain
     */
    updateReputationScore(userAddress: string, newScore: number, metadata?: any): Promise<string>;
    /**
     * Verify a transaction exists on the blockchain
     */
    verifyTransaction(txHash: string): Promise<any>;
    /**
     * Get reputation score from blockchain
     */
    getReputationScore(userAddress: string): Promise<number>;
    /**
     * Create escrow transaction for payment
     */
    createEscrow(amount: number, recruiterAddress: string, candidateAddress: string, jobId: string): Promise<string>;
}
export declare const tronService: TronService;
//# sourceMappingURL=tronService.d.ts.map