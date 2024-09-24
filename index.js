"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const crypto = __importStar(require("crypto"));
const Certificate_1 = __importDefault(require("./Certificate")); // Import Certificate class
class Block {
    constructor(prevHash, certificate, ts = Date.now()) {
        this.prevHash = prevHash;
        this.certificate = certificate;
        this.ts = ts;
        this.nonce = Math.round(Math.random() * 999999999);
    }
    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(str).end();
        return hash.digest('hex');
    }
}
class Chain {
    constructor() {
        // Genesis block
        this.chain = [new Block('', new Certificate_1.default('genesis', 'Genesis Course', '0', ''))];
    }
    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }
    mine(nonce) {
        let solution = 1;
        console.log('⛏️  mining...');
        while (true) {
            const hash = crypto.createHash('MD5');
            hash.update((nonce + solution).toString()).end();
            const attempt = hash.digest('hex');
            if (attempt.substr(0, 4) === '0000') {
                console.log(`Solved: ${solution}`);
                return solution;
            }
            solution += 1;
        }
    }
    addBlock(certificate) {
        const newBlock = new Block(this.lastBlock.hash, certificate);
        this.mine(newBlock.nonce);
        this.chain.push(newBlock);
    }
    // Update verifyCertificate to hash the input fileHash before checking
    verifyCertificate(fileHash, userID) {
        // No need for an extra hashedFileHash property, we use fileHash itself
        const hashedInputFileHash = this.hashInputFileHash(fileHash);
        for (const block of this.chain) {
            if (block.certificate.fileHash === hashedInputFileHash && block.certificate.userID === userID) {
                return true;
            }
        }
        return false;
    }
    hashInputFileHash(fileHash) {
        const hash = crypto.createHash('SHA256');
        hash.update(fileHash).end();
        return hash.digest('hex');
    }
    getCertificatesByUserID(userID) {
        return this.chain
            .filter(block => block.certificate.userID === userID)
            .map(block => block.certificate);
    }
}
exports.Chain = Chain;
Chain.instance = new Chain();
// Instantiate the blockchain (Chain)
const blockchain = Chain.instance;
// Create certificates for different users
const certificate1 = new Certificate_1.default('abc123', 'Blockchain Basics', 'user1', '2024-09-24');
const certificate2 = new Certificate_1.default('abc123', 'Advanced Solidity', 'user1', '2024-09-25');
const certificate3 = new Certificate_1.default('def456', 'Ethereum Smart Contracts', 'user2', '2024-09-26');
// Add the certificates as blocks to the blockchain
blockchain.addBlock(certificate1);
blockchain.addBlock(certificate2);
blockchain.addBlock(certificate3);
// Verify certificates for user1 and user2
const isVerifiedUser1Cert1 = blockchain.verifyCertificate('babc123', 'user1');
const isVerifiedUser2Cert = blockchain.verifyCertificate('def456', 'user2');
// Fetch all certificates for a specific user
const user1Certificates = blockchain.getCertificatesByUserID('user1');
// Outputs
console.log('User 1 Certificate Verification:', isVerifiedUser1Cert1);
console.log('User 2 Certificate Verification:', isVerifiedUser2Cert);
console.log('Certificates for User 1:', user1Certificates);
