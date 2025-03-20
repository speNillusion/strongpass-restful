import * as jwt from 'jsonwebtoken';


interface IToken {
    generateToken(userId: number, secretKey: string): Promise<string>;
    verifyToken(token: string, secretKey: string): Promise<boolean>;
}

export class UserToken implements IToken {

    public async verifyToken(token: string, secretKey: string): Promise<any> {
        try {
            return jwt.verify(token, secretKey);
        } catch (error) {
            console.log(error)
            return false;
        }
    };

    public async generateToken(userId: number, secretKey: string): Promise<string> {
        try {
            return jwt.sign({ userId: userId }, secretKey, { expiresIn: '1h' });
        } catch (error) {
            return '';
        }
    }
}
