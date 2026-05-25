import { IRegistrarAdmin, CrearAdminCommand } from "../ports/in/iam.port";
import { User } from "../domain/user";
import { IUserRepository } from "../ports/out/userRepository.port";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RegistrarAdmin implements IRegistrarAdmin {
  constructor(private readonly UserRepository: IUserRepository) {}
  async execute(user: CrearAdminCommand): Promise<any> {
    const newUser = await User.crearAdmin(user.name, user.email, user.password);
    await this.UserRepository.save(newUser);
    return {
      name: newUser.name,
      email: newUser.email.getEmail(),
      typeUser: newUser.type,
    };
  }
}
