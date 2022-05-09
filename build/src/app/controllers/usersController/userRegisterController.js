"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const auth_json_1 = __importDefault(require("@config/auth.json"));
const insertUsersModel_1 = __importDefault(require("@models/usersModel/insertUsersModel"));
const getUserModels_1 = __importDefault(require("@models/usersModel/getUserModels"));
const generateToken = (params = {}) => {
    return jsonwebtoken_1.default.sign(params, auth_json_1.default.secret, {
        expiresIn: 86400
    });
};
class RegisterUser {
    async index(request, response) {
        const { email, password, profile } = request.body;
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }
        if (!email || !password || !profile) {
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
        const checkProfile = await (0, express_validator_1.check)('profile')
            .notEmpty()
            .custom((value) => {
            const validUserTypes = [
                'User',
                'Admin'
            ];
            return validUserTypes.includes(value);
        })
            .run(request);
        if (checkEmail.context.errors.length > 0 ||
            checkProfile.context.errors.length > 0 ||
            checkPassword.context.errors.length > 0) {
            return response.status(406).json({
                error: 'incorrect parameters'
            });
        }
        try {
            const [checkUserEmail] = await getUserModels_1.default.getUserRegister(email);
            if (checkUserEmail) {
                return response.status(409).json({ error: 'this user is already registered' });
            }
            const hashPassword = await bcryptjs_1.default.hash(password, 10);
            const resultInsert = await insertUsersModel_1.default.insertUser(email, hashPassword, profile);
            if (resultInsert.length > 0) {
                return response.status(200).json({
                    body: {
                        email,
                        token: generateToken({ id: resultInsert[0] })
                    }
                });
            }
            else {
                return response.status(500).json({ error: 'error registering user' });
            }
        }
        catch (error) {
            console.log(error);
            return response.status(500).json({ error });
        }
    }
}
exports.default = new RegisterUser();
