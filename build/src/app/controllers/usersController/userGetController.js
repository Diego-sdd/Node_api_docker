"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const auth_json_1 = __importDefault(require("@config/auth.json"));
const getUserModels_1 = __importDefault(require("@models/usersModel/getUserModels"));
const generateToken = (params = {}) => {
    return jsonwebtoken_1.default.sign(params, auth_json_1.default.secret, {
        expiresIn: 86400
    });
};
class Users {
    async login(request, response) {
        const { email, password } = request.query;
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }
        if (!email || !password) {
            return response.status(404).json({ body: 'missing information' });
        }
        const checkEmail = await (0, express_validator_1.check)('email')
            .notEmpty()
            .isEmail()
            .run(request);
        const checkPassword = await (0, express_validator_1.check)('password')
            .notEmpty()
            .isLength({ min: 5 })
            .run(request);
        if (checkEmail.context.errors.length > 0 ||
            checkPassword.context.errors.length > 0) {
            return response.status(406).json({
                error: 'incorrect parameters'
            });
        }
        try {
            const resultRegisterUser = await getUserModels_1.default.getUserRegister(email);
            if (resultRegisterUser.length === 0) {
                return response.status(404).json({ body: 'User not found' });
            }
            else {
                if (!await bcryptjs_1.default.compare(password, resultRegisterUser[0].password)) {
                    return response.status(404).send({ error: 'Invalid password' });
                }
                delete resultRegisterUser[0].cd_senha;
                return response.status(200).json({
                    body: {
                        email: resultRegisterUser[0].email,
                        token: generateToken({ id: resultRegisterUser[0].id })
                    }
                });
            }
        }
        catch (error) {
            console.log(error);
            return response.status(500).json({ error });
        }
    }
}
exports.default = new Users();
