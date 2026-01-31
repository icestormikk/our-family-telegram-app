import {createHash, randomBytes, createCipheriv, createDecipheriv} from "node:crypto";
import ICrypto from "../abstract/ICrypto";

export default class DefaultCrypto implements ICrypto {
    private readonly _algorithm: string;
    private readonly _key: string;
    private readonly _iv: Buffer<ArrayBuffer>;

    public constructor(secretKey: string) {
        this._algorithm = "aes-256-cbc";
        this._key = createHash("sha512").update(secretKey).digest("hex").substring(0, 32);
        this._iv = randomBytes(16);
    }

    encrypt(data: string): string {
        const cipher = createCipheriv(this._algorithm, Buffer.from(this._key), this._iv);

        let encrypted = cipher.update(data, "utf-8", "hex");
        encrypted += cipher.final("hex");

        return this._iv.toString("hex") + encrypted;
    }

    decrypt(secret: string): string {
        const ivInput = secret.slice(0, 32);
        const encrypted = secret.slice(32);
        const decipher = createDecipheriv(this._algorithm, Buffer.from(this._key), Buffer.from(ivInput, "hex"));

        let decrypted = decipher.update(encrypted, "hex", "utf-8");
        decrypted += decipher.final("utf-8");
        return decrypted;
    }
}