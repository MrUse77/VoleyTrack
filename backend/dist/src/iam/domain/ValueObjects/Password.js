"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
class Password {
    value;
    constructor(v) {
        this.value = v;
    }
    static async fromPlainText(v) {
        let hashedValue = await Bun.password.hash(v, {
            algorithm: "bcrypt",
        });
        return new Password(hashedValue);
    }
    static fromDatabase(v) {
        return new Password(v);
    }
    async verifyPassword(v) {
        return await Bun.password.verify(v, this.value, "bcrypt");
    }
    getValue() {
        return this.value;
    }
}
exports.Password = Password;
//# sourceMappingURL=Password.js.map