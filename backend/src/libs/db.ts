import {Pool} from 'pg';

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'remember_me',
    user: 'remember_me_user',
    password: 'remember_me_password',
});

export default pool;