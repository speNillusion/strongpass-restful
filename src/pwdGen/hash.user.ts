import { PwdEncrypt } from "src/users/DTO/dto.password";

export function Hash(user: object): Promise<string> {
    return new Promise((resolve, _) => {
        const hash = new PwdEncrypt(user).crypt();
        resolve(hash);
    });
}