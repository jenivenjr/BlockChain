import * as crypto from 'crypto';
import  Certificate  from './Certificate'; // Import Certificate class

class Block {
  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string,
    public certificate: Certificate,
    public ts = Date.now()
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }
}

class Chain {
  public static instance = new Chain();
  chain: Block[];

  constructor() {
    // Genesis block
    this.chain = [new Block('', new Certificate('genesis', 'Genesis Course', '0', ''))];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(nonce: number) {
    let solution = 1;
    console.log('⛏️  mining...')

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

  addBlock(certificate: Certificate) {
    const newBlock = new Block(this.lastBlock.hash, certificate);
    this.mine(newBlock.nonce);
    this.chain.push(newBlock);
  }

  // Update verifyCertificate to hash the input fileHash before checking
  verifyCertificate(fileHash: string, userID: string): boolean {
    // No need for an extra hashedFileHash property, we use fileHash itself
    const hashedInputFileHash = this.hashInputFileHash(fileHash);

    for (const block of this.chain) {
      if (block.certificate.fileHash === hashedInputFileHash && block.certificate.userID === userID) {
        return true;
      }
    }
    return false;
  }
  private hashInputFileHash(fileHash: string): string {
    const hash = crypto.createHash('SHA256');
    hash.update(fileHash).end();
    return hash.digest('hex');
  }

  getCertificatesByUserID(userID: string): Certificate[] {
    return this.chain
      .filter(block => block.certificate.userID === userID)
      .map(block => block.certificate);
  }
}

// Instantiate the blockchain (Chain)
const blockchain = Chain.instance;

// Create certificates for different users
const certificate1 = new Certificate('abc123', 'Blockchain Basics', 'user1', '2024-09-24');
const certificate2 = new Certificate('abc123', 'Advanced Solidity', 'user1', '2024-09-25');
const certificate3 = new Certificate('def456', 'Ethereum Smart Contracts', 'user2', '2024-09-26');

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
export { Chain };