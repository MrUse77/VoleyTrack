import { ICambiarContraseña } from "../ports/in/iam.port";
import { IUserRepository } from "../ports/out/userRepository.port";
export declare class CambiarContraseña implements ICambiarContraseña {
    private readonly UserRepository;
    constructor(UserRepository: IUserRepository);
    execute(id: string, newPassword: string): Promise<any>;
}
