import { TypeUser } from "./Enums/TypeUser";
import { Email, Password } from "./ValueObjects";

export class User {
  public name: string;
  public email: Email;
  public password: Password;
  public type: TypeUser;

  private constructor(
    name: string,
    email: Email,
    password: Password,
    type: TypeUser,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  public static async crearAdmin(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    let pass: Password = await Password.fromPlainText(password);
    return new User(name, new Email(email), pass, TypeUser.ADMIN);
  }
  public static async crearPlanillero(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    let pass: Password = await Password.fromPlainText(password);
    return new User(name, new Email(email), pass, TypeUser.PLANILLERO);
  }
  public static async crearInvitado(
    name: string,
    email: string,
    password: string,
  ) {
    let pass: Password = await Password.fromPlainText(password);
    return new User(name, new Email(email), pass, TypeUser.INVITADO);
  }
  public async changePassword(newPassword: string): Promise<void> {
    this.password = await Password.fromPlainText(newPassword);
  }
  public changeEmail(newEmail: string): void {
    this.email = new Email(newEmail);
  }
  public async comparePassword(pass: string) {
    return this.password.verifyPassword(pass);
  }
  public static restore(
    name: string,
    email: string,
    password: string,
    userType: TypeUser,
  ): User {
    return new User(
      name,
      new Email(email),
      Password.fromDatabase(password),
      userType,
    );
  }
}
