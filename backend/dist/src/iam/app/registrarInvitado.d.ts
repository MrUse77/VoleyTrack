import { IRegistrarInvitado } from "../ports/in/iam.port";
import { IUserRepository } from "../ports/out/userRepository.port";
import { CrearInvitadoCommand } from "../ports/in/iam.port";
export declare class RegistrarInvitado implements IRegistrarInvitado {
    private readonly UserRepository;
    constructor(UserRepository: IUserRepository);
    execute(user: CrearInvitadoCommand): Promise<any>;
}
