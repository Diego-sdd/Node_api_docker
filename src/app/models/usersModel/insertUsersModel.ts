
import knex from '@src/database/knex'

class UserModel {
  async insertUser (email: String, password: String, profile: String) {
    const resultRegiterUser = await knex('tb_users')
      .insert({
        email,
        password,
        profile
      })

    return resultRegiterUser
  }
}

export default new UserModel()
