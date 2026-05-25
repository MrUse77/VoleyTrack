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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("./dtos");
const iam_port_1 = require("../../ports/in/iam.port");
let UserController = class UserController {
    registrarPlanillero;
    registrarAdmin;
    registrarInvitado;
    iniciarSesion;
    constructor(registrarPlanillero, registrarAdmin, registrarInvitado, iniciarSesion) {
        this.registrarPlanillero = registrarPlanillero;
        this.registrarAdmin = registrarAdmin;
        this.registrarInvitado = registrarInvitado;
        this.iniciarSesion = iniciarSesion;
    }
    async crearPlanillero(dto) {
        try {
            const planillero = {
                name: dto.name,
                email: dto.emailRaw,
                password: dto.passwordRaw,
            };
            const newPlanillero = await this.registrarPlanillero.execute(planillero);
            return newPlanillero;
        }
        catch {
            return new common_1.HttpException("No fue posible crear el planillero", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async crearAdmin(dto) {
        try {
            const admin = {
                name: dto.name,
                email: dto.emailRaw,
                password: dto.passwordRaw,
            };
            return await this.registrarAdmin.execute(admin);
        }
        catch (e) {
            console.error(e);
            return new common_1.HttpException("No fue posible crear el admin", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async crearInvitado(dto) {
        try {
            const invitado = {
                name: dto.name,
                email: dto.emailRaw,
                password: dto.passwordRaw,
            };
            return await this.registrarInvitado.execute(invitado);
        }
        catch {
            return new common_1.HttpException("No fue posible crear el invitado", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(dto) {
        try {
            const user = {
                email: dto.emailRaw,
                password: dto.passwordRaw,
            };
            return await this.iniciarSesion.execute(user);
        }
        catch (e) {
            return new common_1.HttpException("No fue posible iniciar sesion", common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)("register/planillero"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreatePlanilleroDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "crearPlanillero", null);
__decorate([
    (0, common_1.Post)("register/admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "crearAdmin", null);
__decorate([
    (0, common_1.Post)("register/invitado"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateInvitadoDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "crearInvitado", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [iam_port_1.IRegistrarPlanillero,
        iam_port_1.IRegistrarAdmin,
        iam_port_1.IRegistrarInvitado,
        iam_port_1.IIniciarSesion])
], UserController);
//# sourceMappingURL=UserController.js.map