const {
    MAIN_DB_CLIENT,
    MAIN_DB_HOST,
    MAIN_DB_PORT,
    MAIN_DB_USER,
    MAIN_DB_PASSWORD,
    MAIN_DB_NAME,
    MAIN_DB_MIN_POOL,
    MAIN_DB_MAX_POOL
} = process.env

const knexQ = require('knex')({
    client: MAIN_DB_CLIENT,
    connection: {
        host: MAIN_DB_HOST,
        port: MAIN_DB_PORT,
        user: MAIN_DB_USER,
        password: MAIN_DB_PASSWORD,
        database: MAIN_DB_NAME
    },
    pool: {
        min: parseInt(MAIN_DB_MIN_POOL),
        max: parseInt(MAIN_DB_MAX_POOL)
    }
})

module.exports = { knexQ }