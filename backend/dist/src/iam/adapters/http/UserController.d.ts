import { HttpException } from "@nestjs/common";
import { CreatePlanilleroDto, CreateAdminDto, CreateInvitadoDto, LoginDto } from "./dtos";
import { IRegistrarPlanillero, IRegistrarAdmin, IRegistrarInvitado, IIniciarSesion } from "../../ports/in/iam.port";
export declare class UserController {
    private readonly registrarPlanillero;
    private readonly registrarAdmin;
    private readonly registrarInvitado;
    private readonly iniciarSesion;
    constructor(registrarPlanillero: IRegistrarPlanillero, registrarAdmin: IRegistrarAdmin, registrarInvitado: IRegistrarInvitado, iniciarSesion: IIniciarSesion);
    crearPlanillero(dto: CreatePlanilleroDto): Promise<import("../../ports/in/iam.port").getRegistrarPlanillero | HttpException>;
    crearAdmin(dto: CreateAdminDto): Promise<import("../../ports/in/iam.port").getRegistrarAdmin | HttpException>;
    crearInvitado(dto: CreateInvitadoDto): Promise<import("../../ports/in/iam.port").getRegistrarInvitado | HttpException>;
    login(dto: LoginDto): Promise<import("../../ports/in/iam.port").sessionCommand | HttpException>;
}
