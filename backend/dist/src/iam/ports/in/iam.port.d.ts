export type TypeUser = "ADMIN" | "PLANILLERO" | "INVITADO";
export interface getRegistrarPlanillero {
    name: string;
    email: string;
    typeUser: TypeUser;
}
export interface getRegistrarInvitado {
    name: string;
    email: string;
    typeUser: TypeUser;
}
export interface getRegistrarAdmin {
    name: string;
    email: string;
    typeUser: TypeUser;
}
export interface CrearAdminCommand {
    name: string;
    email: string;
    password: string;
}
export interface CrearInvitadoCommand {
    name: string;
    email: string;
    password: string;
}
export interface CrearPlanilleroCommand {
    name: string;
    email: string;
    password: string;
}
export interface userSessionCommand {
    email: string;
    password: string;
}
export interface sessionCommand {
    access_token: string;
}
export declare abstract class IRegistrarPlanillero {
    abstract execute(planillero: CrearPlanilleroCommand): Promise<getRegistrarPlanillero>;
}
export declare abstract class IRegistrarAdmin {
    abstract execute(admin: CrearAdminCommand): Promise<getRegistrarAdmin>;
}
export declare abstract class IRegistrarInvitado {
    abstract execute(admin: CrearInvitadoCommand): Promise<getRegistrarInvitado>;
}
export declare abstract class ICambiarContraseña {
    abstract execute(id: string, newPassword: string): Promise<void>;
}
export declare abstract class ICerrarSesion {
    abstract execute(id: string, token: string): Promise<void>;
}
export declare abstract class IIniciarSesion {
    abstract execute(userSesion: userSessionCommand): Promise<sessionCommand>;
}
