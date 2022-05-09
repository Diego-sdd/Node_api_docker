
import knex from '@src/database/knex'

class UserModel {
  async getUserRegister (email: String) {
    const resultUser = await knex('tb_users')
      .select('*')
      .where('email', email)

    return resultUser
  }
}

export default new UserModel()
