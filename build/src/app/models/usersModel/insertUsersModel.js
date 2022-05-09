"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("@src/database/knex"));
class UserModel {
    async insertUser(email, password, profile) {
        const resultRegiterUser = await (0, knex_1.default)('tb_users')
            .insert({
            email,
            password,
            profile
        });
        return resultRegiterUser;
    }
}
exports.default = new UserModel();
