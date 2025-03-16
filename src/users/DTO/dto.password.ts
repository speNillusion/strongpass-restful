import { createHash } from 'crypto';

export class PwdEncrypt {
    private arg: string;

    constructor(arg: string) {
        this.arg = arg;
    }

    crypt(): string {
        return createHash('sha256').update(this.arg).digest('hex');
    }
}
