"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'tb_tasks';
async function up(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.string('description');
        table.string('status', 50);
        table.timestamp('deadline');
        table.timestamp('update_at');
        table.timestamp('finished_at');
        table.integer('fk_id_user')
            .unsigned()
            .references('id')
            .inTable('tb_users');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at').defaultTo(null);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable(tableName);
}
exports.down = down;
