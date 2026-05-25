import { IRegistrarInvitado } from "../ports/in/iam.port";
import { IUserRepository } from "../ports/out/userRepository.port";
import { CrearInvitadoCommand } from "../ports/in/iam.port";
import { User } from "../domain/user";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RegistrarInvitado implements IRegistrarInvitado {
  constructor(private readonly UserRepository: IUserRepository) {}
  async execute(user: CrearInvitadoCommand): Promise<any> {
    const newUser = await User.crearInvitado(
      user.name,
      user.email,
      user.password,
    );
    await this.UserRepository.save(newUser);
    return {
      name: newUser.name,
      email: newUser.email.getEmail(),
      typeUser: newUser.type,
    };
  }
}
