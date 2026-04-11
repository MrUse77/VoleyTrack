class Email {
  private value: string;
  constructor(v: string) {
    if (v.includes("@")) {
      this.value = v;
    }
  }
  getEmail(): string {
    return this.value;
  }
}

class Password {
  private value: string;
  constructor(v: string) {
    const hash = async () => {
      return await Bun.password.hash(v, {
        algorithm: "bcrypt",
      });
    };
  }
}

export class User {
  public name: string;
  public email: string;
  public password: string;

  constructor() {}
}
