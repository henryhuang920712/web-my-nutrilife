import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER, // e.g. 'myuser'
  host: process.env.DB_HOST, // e.g. 'localhost'
  database: process.env.DB_NAME, // e.g. 'mydatabase'
  password: process.env.DB_PASSWORD, // e.g. 'mypassword'
  port: process.env.DB_PORT, // e.g. 5432
});

export default pool;