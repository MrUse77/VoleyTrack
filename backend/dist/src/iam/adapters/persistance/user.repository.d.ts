import { PrismaService } from "src/common/prisma/prisma.service";
import { IUserRepository } from "src/iam/ports/out/userRepository.port";
import { User } from "src/iam/domain/user";
export declare class UserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(user: User): Promise<any>;
    update(user: any): Promise<any>;
    findAll(): Promise<any>;
    delete(id: string): Promise<any>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any | null>;
}
