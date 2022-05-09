"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("@src/database/knex"));
class GetTasskModel {
    async getTaskFilterId(idTask) {
        const resultUser = await (0, knex_1.default)('tb_tasks')
            .select('*')
            .where('id', idTask);
        return resultUser;
    }
    async getTaskFilterUser(idUser) {
        const resultUser = await (0, knex_1.default)('tb_tasks')
            .select('*')
            .where('fk_id_user', idUser);
        return resultUser;
    }
    async getTasksAll(page, pageSize, order, orderBy) {
        const resultTasks = await (0, knex_1.default)('tb_tasks')
            .innerJoin('tb_users', 'tb_users.id', 'tb_tasks.fk_id_user')
            .select('tb_tasks.id', 'email', 'description', 'deadline')
            .orderBy(orderBy, order)
            .limit(pageSize)
            .offset(pageSize * page - pageSize + 1);
        return resultTasks;
    }
    async getTasksAllLate(page, pageSize, order, orderBy) {
        const resultTasks = await (0, knex_1.default)('tb_tasks')
            .innerJoin('tb_users', 'tb_users.id', 'tb_tasks.fk_id_user')
            .select('tb_tasks.id', 'email', 'description', 'deadline')
            .whereNull('finished_at')
            .andWhere('deadline', '<', new Date())
            .orderBy(orderBy, order)
            .limit(pageSize)
            .offset(pageSize * page - pageSize + 1);
        return resultTasks;
    }
}
exports.default = new GetTasskModel();
