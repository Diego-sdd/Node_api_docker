
import databaseConfig from '@config/database'

export default {
  client: 'mysql',
  connection: { ...databaseConfig, ssd: true },
  searchPath: ['public'],
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
}
