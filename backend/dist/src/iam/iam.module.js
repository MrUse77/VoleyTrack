"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModule = void 0;
const common_1 = require("@nestjs/common");
const UserController_1 = require("./adapters/http/UserController");
const user_repository_1 = require("./adapters/persistance/user.repository");
const jwt_1 = require("@nestjs/jwt");
const prisma_module_1 = require("src/common/prisma/prisma.module");
const iam_port_1 = require("./ports/in/iam.port");
const userRepository_port_1 = require("./ports/out/userRepository.port");
const app_1 = require("./app");
let IamModule = class IamModule {
};
exports.IamModule = IamModule;
exports.IamModule = IamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                global: true,
                secret: "HOLA",
                signOptions: { expiresIn: "60s" },
            }),
            prisma_module_1.PrismaModule,
        ],
        controllers: [UserController_1.UserController],
        providers: [
            { provide: userRepository_port_1.IUserRepository, useClass: user_repository_1.UserRepository },
            {
                provide: iam_port_1.IRegistrarAdmin,
                useClass: app_1.RegistrarAdmin,
            },
            {
                provide: iam_port_1.IRegistrarInvitado,
                useClass: app_1.RegistrarInvitado,
            },
            {
                provide: iam_port_1.IRegistrarPlanillero,
                useClass: app_1.RegistrarPlanillero,
            },
            {
                provide: iam_port_1.IIniciarSesion,
                useClass: app_1.IniciarSesion,
            },
            {
                provide: iam_port_1.ICerrarSesion,
                useClass: app_1.CerrarSesion,
            },
            {
                provide: iam_port_1.ICambiarContraseña,
                useClass: app_1.CambiarContraseña,
            },
        ],
    })
], IamModule);
//# sourceMappingURL=iam.module.js.map