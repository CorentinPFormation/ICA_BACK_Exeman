/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'corentin',
      password: 'coco11037',
      database: 'ica'
    },
    migrations: {
      directory: '/knex/migrations'
    },
    seeds: {
      directory: '/knex/seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'ica',
      port: 5432,
      user:     'corentin',
      password: 'coco11037'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: '/knex.migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'ica',
      port: 5432,
      user:     'corentin',
      password: 'coco11037'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: '/knex/migrations'
    }
  }

};
