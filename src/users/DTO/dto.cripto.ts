export class Cripto {
    private arg: string;

    constructor(arg: string) {
        this.arg = arg;
    }
    // Método estático para criptografar o email
    static encryptEmail(email: string): string {
        return Buffer.from(email, 'ascii').toString('base64');
    }

    // Métodos de instância para criptografar e descriptografar
    crypt(): string {
        return Buffer.from(this.arg, 'ascii').toString('base64');
    }

    decrypt(): string {
        return Buffer.from(this.arg, 'base64').toString('ascii');
    }
}

