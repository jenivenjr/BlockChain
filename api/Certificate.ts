
import * as crypto from 'crypto';

export default class Certificate {
  constructor(
    public fileHash: string,  
    public courseName: string,
    public userID: string,
    public completionDate: string
  ) {

    this.fileHash = this.hashFileHash(fileHash);
  }
  private hashFileHash(fileHash: string): string {
    const hash = crypto.createHash('SHA256');
    hash.update(fileHash).end();
    return hash.digest('hex');
  }

  toString() {
    return JSON.stringify(this);
  }
}
