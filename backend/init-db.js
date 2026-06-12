require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DATABASE || 'sih_db',
      password: process.env.PG_PASSWORD || 'postgres',
      port: process.env.PG_PORT || 5432,
    };

const pool = new Pool(poolConfig);

async function initDB() {
  try {
    const schema = fs.readFileSync('schema.sql', 'utf8');
    await pool.query(schema);
    console.log('Database schema initialized successfully!');
  } catch (err) {
    console.error('Error initializing database schema:', err);
  } finally {
    await pool.end();
  }
}

initDB();
