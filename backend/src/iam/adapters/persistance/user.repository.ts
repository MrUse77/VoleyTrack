import { PrismaService } from "src/common/prisma/prisma.service";
import { IUserRepository } from "src/iam/ports/out/userRepository.port";
import { Injectable } from "@nestjs/common";
import { User } from "src/iam/domain/user";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<any> {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email.getEmail(),
          password: user.password.getValue(),
          role: user.type as "ADMIN" | "PLANILLERO",
        },
      });
      return newUser;
    } catch (e) {
      throw e;
    }
  }
  async update(user: any): Promise<any> {
    try {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: user,
      });
    } catch (e) {
      throw e;
    }
  }
  async findAll(): Promise<any> {
    try {
      return await this.prisma.user.findMany();
    } catch (e) {
      throw e;
    }
  }
  async delete(id: string): Promise<any> {
    try {
      await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
    } catch (e) {
      throw e;
    }
  }
  async findById(id: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (user) {
        return user;
      }
    } catch (e) {
      throw e;
    }
  }
  async findByEmail(email: string): Promise<any | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
