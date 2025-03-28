import { createHash } from 'crypto';

export class PwdEncrypt {
    private arg: string;

    constructor(arg: string) {
        this.arg = arg;
    }

    crypt(security: number = 1): Promise<string> {
        let hashs = this.arg;
        for (let i = 0; i < security; i++) {
            hashs = createHash('sha256').update(hashs.toString()).digest('hex');
        }
        return Promise.resolve(hashs);
    }

    static async encryptPassword(password: string, security: number = 1): Promise<string> {
        let hashs = password;
        for (let i = 0; i < security; i++) {
            hashs = createHash('sha256').update(hashs).digest('hex');
        }
        return hashs;
    }
}
