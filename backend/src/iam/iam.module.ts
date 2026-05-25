import { Module } from "@nestjs/common";
import { UserController } from "./adapters/http/UserController";
import { UserRepository } from "./adapters/persistance/user.repository";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/common/prisma/prisma.module";
import {
  ICambiarContraseña,
  ICerrarSesion,
  IIniciarSesion,
  IRegistrarAdmin,
  IRegistrarInvitado,
  IRegistrarPlanillero,
} from "./ports/in/iam.port";
import { IUserRepository } from "./ports/out/userRepository.port";
import {
  CambiarContraseña,
  IniciarSesion,
  RegistrarAdmin,
  RegistrarInvitado,
  RegistrarPlanillero,
  CerrarSesion,
} from "./app";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: "HOLA",
      signOptions: { expiresIn: "60s" },
    }),
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [
    { provide: IUserRepository, useClass: UserRepository },
    {
      provide: IRegistrarAdmin,
      useClass: RegistrarAdmin,
    },
    {
      provide: IRegistrarInvitado,
      useClass: RegistrarInvitado,
    },
    {
      provide: IRegistrarPlanillero,
      useClass: RegistrarPlanillero,
    },
    {
      provide: IIniciarSesion,
      useClass: IniciarSesion,
    },
    {
      provide: ICerrarSesion,
      useClass: CerrarSesion,
    },
    {
      provide: ICambiarContraseña,
      useClass: CambiarContraseña,
    },
  ],
})
export class IamModule {}
