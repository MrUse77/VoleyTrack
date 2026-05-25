export class Password {
  private value: string;
  private constructor(v: string) {
    this.value = v;
  }
  public static async fromPlainText(v: string): Promise<Password> {
    let hashedValue: string = await Bun.password.hash(v, {
      algorithm: "bcrypt",
    });
    return new Password(hashedValue);
  }
  public static fromDatabase(v: string): Password {
    return new Password(v);
  }
  public async verifyPassword(v: string): Promise<boolean> {
    return await Bun.password.verify(v, this.value, "bcrypt");
  }
  public getValue(): string {
    return this.value;
  }
}
