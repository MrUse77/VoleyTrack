import { InvalidEmailError } from "../Errors/invalid-email.error";

export class Email {
  private readonly value: string;
  constructor(v: string) {
    if (v.includes("@")) {
      this.value = v;
    } else {
      throw new InvalidEmailError(v);
    }
  }
  getEmail(): string {
    return this.value;
  }
}
