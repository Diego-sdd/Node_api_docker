import { Knex } from 'knex'

const tableName = 'tb_users'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary()
    table.string('email', 100).unique()
    table.string('password')
    table.string('profile', 50)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').defaultTo(null)
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName)
}
