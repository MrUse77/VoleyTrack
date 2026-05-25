"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const invalid_email_error_1 = require("../Errors/invalid-email.error");
class Email {
    value;
    constructor(v) {
        if (v.includes("@")) {
            this.value = v;
        }
        else {
            throw new invalid_email_error_1.InvalidEmailError(v);
        }
    }
    getEmail() {
        return this.value;
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map