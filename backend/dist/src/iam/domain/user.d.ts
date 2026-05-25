import { TypeUser } from "./Enums/TypeUser";
import { Email, Password } from "./ValueObjects";
export declare class User {
    name: string;
    email: Email;
    password: Password;
    type: TypeUser;
    private constructor();
    static crearAdmin(name: string, email: string, password: string): Promise<User>;
    static crearPlanillero(name: string, email: string, password: string): Promise<User>;
    static crearInvitado(name: string, email: string, password: string): Promise<User>;
    changePassword(newPassword: string): Promise<void>;
    changeEmail(newEmail: string): void;
    comparePassword(pass: string): Promise<boolean>;
    static restore(name: string, email: string, password: string, userType: TypeUser): User;
}
