export class Cripto {
    private arg: string;

    constructor(arg: string) {
        this.arg = arg;
    }

    crypt(): string {
        return Buffer.from(this.arg, 'ascii').toString('base64');
    }

    decrypt(): string {
        return Buffer.from(this.arg, 'base64').toString('ascii');
    }
}
