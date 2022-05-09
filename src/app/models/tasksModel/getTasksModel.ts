
import knex from '@src/database/knex'

class GetTasskModel {
  async getTaskFilterId (idTask: String) {
    const resultUser = await knex('tb_tasks')
      .select('*')
      .where('id', idTask)

    return resultUser
  }

  async getTaskFilterUser (idUser: String) {
    const resultUser = await knex('tb_tasks')
      .select('*')
      .where('fk_id_user', idUser)

    return resultUser
  }

  async getTasksAll (
    page: number,
    pageSize: number,
    order: string,
    orderBy: string
  ) {
    const resultTasks = await knex('tb_tasks')
      .innerJoin('tb_users', 'tb_users.id', 'tb_tasks.fk_id_user')
      .select('tb_tasks.id', 'email', 'description', 'deadline')
      .orderBy(orderBy, order)
      .limit(pageSize)
      .offset(pageSize * page - pageSize + 1)

    return resultTasks
  }

  async getTasksAllLate (
    page: number,
    pageSize: number,
    order: string,
    orderBy: string
  ) {
    const resultTasks = await knex('tb_tasks')
      .innerJoin('tb_users', 'tb_users.id', 'tb_tasks.fk_id_user')
      .select('tb_tasks.id', 'email', 'description', 'deadline')
      .whereNull('finished_at')
      .andWhere('deadline', '<', new Date())
      .orderBy(orderBy, order)
      .limit(pageSize)
      .offset(pageSize * page - pageSize + 1)

    return resultTasks
  }
}

export default new GetTasskModel()
