"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("@src/database/knex"));
class TaskModel {
    async insertUserTask(description, status, deadline, fk_id_user) {
        const resultRegiterTasks = await (0, knex_1.default)('tb_tasks')
            .insert({
            description,
            status,
            deadline,
            fk_id_user
        })
            .returning("*");
        return resultRegiterTasks;
    }
}
exports.default = new TaskModel();
