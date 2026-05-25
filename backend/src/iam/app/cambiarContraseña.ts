import { User } from "../domain/user";
import { ICambiarContraseña } from "../ports/in/iam.port";
import { IUserRepository } from "../ports/out/userRepository.port";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CambiarContraseña implements ICambiarContraseña {
  constructor(private readonly UserRepository: IUserRepository) {}
  async execute(id: string, newPassword: string): Promise<any> {
    const userDB = await this.UserRepository.findById(id);
    if (!userDB) {
      throw new Error("Usuario no existe");
    }
    const user = User.restore(
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.userType,
    );
    await user.changePassword(newPassword);
    await this.UserRepository.update(user);
    return;
  }
}
