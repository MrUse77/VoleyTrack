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
exports.IniciarSesion = void 0;
const userRepository_port_1 = require("../ports/out/userRepository.port");
const user_1 = require("../domain/user");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
let IniciarSesion = class IniciarSesion {
    UserRepository;
    jwtService;
    constructor(UserRepository, jwtService) {
        this.UserRepository = UserRepository;
        this.jwtService = jwtService;
    }
    async execute(userSesion) {
        const userDB = await this.UserRepository.findByEmail(userSesion.email);
        if (!userDB) {
            throw new Error("Usuario no existe");
        }
        const user = user_1.User.restore(userDB.name, userDB.email, userDB.password, userDB.userType);
        if (!(await user.comparePassword(userSesion.password))) {
            throw new Error("Contraseña incorrecta");
        }
        const payload = { sub: user.email.getEmail(), username: user.name };
        const res = {
            access_token: await this.jwtService.signAsync(payload),
        };
        return res;
    }
};
exports.IniciarSesion = IniciarSesion;
exports.IniciarSesion = IniciarSesion = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [userRepository_port_1.IUserRepository,
        jwt_1.JwtService])
], IniciarSesion);
//# sourceMappingURL=iniciarSesion.js.map