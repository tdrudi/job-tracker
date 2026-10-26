const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

async function initDb() {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL connected successfully via Pool');

        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await client.query(schemaSql);
            console.log('Database schema synchronized successfully.');
        }
        client.release();
    } catch (err) {
        console.error('PostgreSQL connection or schema error:', err.stack || err.message);
    }
}

initDb();

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
    pool
};