export default interface ICrypto {
    encrypt(data: string): string;
    decrypt(secret: string): string;
}