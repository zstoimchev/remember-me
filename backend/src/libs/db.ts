import { Pool } from 'pg';

const pool = new Pool({
  user: 'remember_me_user',
  host: 'localhost',
  database: 'remember_me',
  password: 'newpassword123',
  port: 5433,
});

export default pool;