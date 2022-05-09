
import knex from '@src/database/knex'

class TaskModel {
    async finishUserTask(idTask: number) {
        const resultTask = await knex('tb_tasks')
            .update({
                status: "Done",
                finished_at: new Date()
            })
            .where("id", idTask)

        return resultTask
    }
    async updateUserTask(idTask: number, description: String, deadline: Date) {
        const resultTask = await knex('tb_tasks')
            .update({
                deadline,
                description,
                update_at: new Date()
            })
            .where("id", idTask)

        return resultTask
    }
}

export default new TaskModel()
