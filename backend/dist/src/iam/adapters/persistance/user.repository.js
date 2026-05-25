"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_service_1 = require("src/common/prisma/prisma.service");
const common_1 = require("@nestjs/common");
let UserRepository = class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(user) {
        try {
            const newUser = await this.prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email.getEmail(),
                    password: user.password.getValue(),
                    role: user.type,
                },
            });
            return newUser;
        }
        catch (e) {
            throw e;
        }
    }
    async update(user) {
        try {
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: user,
            });
        }
        catch (e) {
            throw e;
        }
    }
    async findAll() {
        try {
            return await this.prisma.user.findMany();
        }
        catch (e) {
            throw e;
        }
    }
    async delete(id) {
        try {
            await this.prisma.user.delete({
                where: {
                    id: id,
                },
            });
        }
        catch (e) {
            throw e;
        }
    }
    async findById(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (user) {
                return user;
            }
        }
        catch (e) {
            throw e;
        }
    }
    async findByEmail(email) {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map