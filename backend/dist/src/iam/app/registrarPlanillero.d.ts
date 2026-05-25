import { IUserRepository } from "../ports/out/userRepository.port";
import { IRegistrarPlanillero, getRegistrarPlanillero, CrearPlanilleroCommand } from "../ports/in/iam.port";
export declare class RegistrarPlanillero implements IRegistrarPlanillero {
    private readonly UserRepository;
    constructor(UserRepository: IUserRepository);
    execute(user: CrearPlanilleroCommand): Promise<getRegistrarPlanillero>;
}
