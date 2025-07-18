import { ethers } from 'ethers';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

export class AddressValidator {
    static validateAddress(address: string, chain: string): string {
        switch (chain.toLowerCase()) {
            case 'eth':
            case 'bsc':
            case 'axax':
            case 'polygon':
            case 'op':
                return AddressValidator.validateEVMAddress(address);
            case 'solana':
                return AddressValidator.validateSolanaAddress(address);
            case 'near':
                return AddressValidator.validateNearAddress(address);
            default:
                throw new Error(`Unsupported chain: ${chain}`);
        }
    }

    private static validateEVMAddress(address: string): string {
        try {
            return ethers.utils.getAddress(address);
        } catch (error) {
            throw new Error(`Invalid EVM address: ${address}`);
        }
    }

    private static validateSolanaAddress(address: string): string {
        try {
            if (!bs58.decode(address)) {
                throw new Error('Invalid base58 format');
            }
            new PublicKey(address);
            return address;
        } catch (error) {
            throw new Error(`Invalid Solana address: ${address}`);
        }
    }

    private static validateNearAddress(address: string): string {
        const nearAddressRegex = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
        if (!nearAddressRegex.test(address)) {
            throw new Error(`Invalid NEAR address: ${address}`);
        }
        return address;
    }
}