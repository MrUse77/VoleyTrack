import { User } from "../domain/user";
import { IUserRepository } from "../ports/out/userRepository.port";
import {
  IRegistrarPlanillero,
  getRegistrarPlanillero,
  CrearPlanilleroCommand,
} from "../ports/in/iam.port";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RegistrarPlanillero implements IRegistrarPlanillero {
  constructor(private readonly UserRepository: IUserRepository) {}
  async execute(user: CrearPlanilleroCommand): Promise<getRegistrarPlanillero> {
    const newUser = await User.crearPlanillero(
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
