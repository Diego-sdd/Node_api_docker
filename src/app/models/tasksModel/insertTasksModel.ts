
import knex from '@src/database/knex'

class TaskModel {
  async insertUserTask(description: String, status: String, deadline: Date, fk_id_user: number) {
    const resultRegiterTasks = await knex('tb_tasks')
      .insert({
        description,
        status,
        deadline,
        fk_id_user
      })
      .returning("*")

    return resultRegiterTasks
  }
}

export default new TaskModel()
