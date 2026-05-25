import { IIniciarSesion, userSessionCommand, sessionCommand } from "../ports/in/iam.port";
import { IUserRepository } from "../ports/out/userRepository.port";
import { JwtService } from "@nestjs/jwt";
export declare class IniciarSesion implements IIniciarSesion {
    private readonly UserRepository;
    private readonly jwtService;
    constructor(UserRepository: IUserRepository, jwtService: JwtService);
    execute(userSesion: userSessionCommand): Promise<sessionCommand>;
}
