"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const TypeUser_1 = require("./Enums/TypeUser");
const ValueObjects_1 = require("./ValueObjects");
class User {
    name;
    email;
    password;
    type;
    constructor(name, email, password, type) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
    }
    static async crearAdmin(name, email, password) {
        let pass = await ValueObjects_1.Password.fromPlainText(password);
        return new User(name, new ValueObjects_1.Email(email), pass, TypeUser_1.TypeUser.ADMIN);
    }
    static async crearPlanillero(name, email, password) {
        let pass = await ValueObjects_1.Password.fromPlainText(password);
        return new User(name, new ValueObjects_1.Email(email), pass, TypeUser_1.TypeUser.PLANILLERO);
    }
    static async crearInvitado(name, email, password) {
        let pass = await ValueObjects_1.Password.fromPlainText(password);
        return new User(name, new ValueObjects_1.Email(email), pass, TypeUser_1.TypeUser.INVITADO);
    }
    async changePassword(newPassword) {
        this.password = await ValueObjects_1.Password.fromPlainText(newPassword);
    }
    changeEmail(newEmail) {
        this.email = new ValueObjects_1.Email(newEmail);
    }
    async comparePassword(pass) {
        return this.password.verifyPassword(pass);
    }
    static restore(name, email, password, userType) {
        return new User(name, new ValueObjects_1.Email(email), ValueObjects_1.Password.fromDatabase(password), userType);
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map