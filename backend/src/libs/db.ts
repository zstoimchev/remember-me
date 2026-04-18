import { Pool } from 'pg';

const pool = new Pool({
  user: 'remember_me_user',
  host: 'localhost',
  database: 'remember_me',
  password: 'remember_me_password',
  port: 5432,
});

export default pool;