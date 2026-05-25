"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidEmailError = void 0;
class InvalidEmailError extends Error {
    constructor(email) {
        super(`Email inválido: ${email}`);
        this.name = "InvalidEmailError";
    }
}
exports.InvalidEmailError = InvalidEmailError;
//# sourceMappingURL=invalid-email.error.js.map