import {
  IIniciarSesion,
  userSessionCommand,
  sessionCommand,
} from "../ports/in/iam.port";
import { IUserRepository } from "../ports/out/userRepository.port";
import { User } from "../domain/user";
import { JwtService } from "@nestjs/jwt";

import { Injectable } from "@nestjs/common";

@Injectable()
export class IniciarSesion implements IIniciarSesion {
  constructor(
    private readonly UserRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async execute(userSesion: userSessionCommand): Promise<sessionCommand> {
    const userDB = await this.UserRepository.findByEmail(userSesion.email);
    if (!userDB) {
      throw new Error("Usuario no existe");
    }
    const user = User.restore(
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.userType,
    );
    if (!(await user.comparePassword(userSesion.password))) {
      throw new Error("Contraseña incorrecta");
    }
    const payload = { sub: user.email.getEmail(), username: user.name };
    const res = {
      access_token: await this.jwtService.signAsync(payload),
    };
    return res;
  }
}
