"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tableName = 'tb_users';
async function up(knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.string('email', 100).unique();
        table.string('password');
        table.string('profile', 50);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at').defaultTo(null);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable(tableName);
}
exports.down = down;
