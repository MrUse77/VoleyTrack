export declare class Password {
    private value;
    private constructor();
    static fromPlainText(v: string): Promise<Password>;
    static fromDatabase(v: string): Password;
    verifyPassword(v: string): Promise<boolean>;
    getValue(): string;
}
