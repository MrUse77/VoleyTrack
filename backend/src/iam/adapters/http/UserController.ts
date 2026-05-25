// adapters/http/controllers/user.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
// Importamos el DTO del adaptador
import {
  CreatePlanilleroDto,
  CreateAdminDto,
  CreateInvitadoDto,
  LoginDto,
} from "./dtos";
import {
  IRegistrarPlanillero,
  IRegistrarAdmin,
  IRegistrarInvitado,
  IIniciarSesion,
  ICerrarSesion,
  userSessionCommand,
  CrearPlanilleroCommand,
  CrearAdminCommand,
  CrearInvitadoCommand,
} from "../../ports/in/iam.port";

@Controller("user")
export class UserController {
  constructor(
    private readonly registrarPlanillero: IRegistrarPlanillero,
    private readonly registrarAdmin: IRegistrarAdmin,
    private readonly registrarInvitado: IRegistrarInvitado,
    private readonly iniciarSesion: IIniciarSesion,
  ) {}
  @Post("register/planillero")
  async crearPlanillero(@Body() dto: CreatePlanilleroDto) {
    try {
      const planillero: CrearPlanilleroCommand = {
        name: dto.name,
        email: dto.emailRaw,
        password: dto.passwordRaw,
      };
      const newPlanillero = await this.registrarPlanillero.execute(planillero);
      return newPlanillero;
    } catch {
      return new HttpException(
        "No fue posible crear el planillero",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post("register/admin")
  async crearAdmin(@Body() dto: CreateAdminDto) {
    try {
      const admin: CrearAdminCommand = {
        name: dto.name,
        email: dto.emailRaw,
        password: dto.passwordRaw,
      };
      return await this.registrarAdmin.execute(admin);
    } catch (e) {
      console.error(e);
      return new HttpException(
        "No fue posible crear el admin",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post("register/invitado")
  async crearInvitado(@Body() dto: CreateInvitadoDto) {
    try {
      const invitado: CrearInvitadoCommand = {
        name: dto.name,
        email: dto.emailRaw,
        password: dto.passwordRaw,
      };
      return await this.registrarInvitado.execute(invitado);
    } catch {
      return new HttpException(
        "No fue posible crear el invitado",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post("login")
  async login(@Body() dto: LoginDto) {
    try {
      const user: userSessionCommand = {
        email: dto.emailRaw,
        password: dto.passwordRaw,
      };
      return await this.iniciarSesion.execute(user);
    } catch (e) {
      return new HttpException(
        "No fue posible iniciar sesion",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /*
  @Post("logout")
  async logout(@Body() dto: any) {
    try {
      await this.cerrarSesion.execute(dto.id, dto.token);
    } catch (e) {
      return new HttpException(
        "No fue posible iniciar sesion",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  */
}
