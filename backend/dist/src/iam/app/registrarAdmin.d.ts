import { IRegistrarAdmin, CrearAdminCommand } from "../ports/in/iam.port";
import { IUserRepository } from "../ports/out/userRepository.port";
export declare class RegistrarAdmin implements IRegistrarAdmin {
    private readonly UserRepository;
    constructor(UserRepository: IUserRepository);
    execute(user: CrearAdminCommand): Promise<any>;
}
