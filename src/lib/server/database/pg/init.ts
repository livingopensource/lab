import { env } from '$env/dynamic/private'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

export default pool