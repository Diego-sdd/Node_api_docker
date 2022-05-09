"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("@src/database/knex"));
class TaskModel {
    async finishUserTask(idTask) {
        const resultTask = await (0, knex_1.default)('tb_tasks')
            .update({
            status: "Done",
            finished_at: new Date()
        })
            .where("id", idTask);
        return resultTask;
    }
    async updateUserTask(idTask, description, deadline) {
        const resultTask = await (0, knex_1.default)('tb_tasks')
            .update({
            deadline,
            description,
            update_at: new Date()
        })
            .where("id", idTask);
        return resultTask;
    }
}
exports.default = new TaskModel();
