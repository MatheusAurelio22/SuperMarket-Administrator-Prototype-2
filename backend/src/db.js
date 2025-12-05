import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'supermarket',
  password: 'matheus22',
  port: 5432
});

export default db;
