import { Knex } from 'knex'

const tableName = 'tb_tasks'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary()
    table.string('description')
    table.string('status', 50)
    table.timestamp('deadline')
    table.timestamp('update_at')
    table.timestamp('finished_at')
    table.integer('fk_id_user')
      .unsigned()
      .references('id')
      .inTable('tb_users')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').defaultTo(null)
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName)
}
