import { Pool } from 'pg';
import { config } from 'dotenv';
import { pathToFileURL } from 'url'; // Not needed for this test but used in main code

config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Mask password for logging if needed, or just log length
// console.log('Password length:', process.env.POSTGRES_PASSWORD?.length);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function test() {
    try {
        console.log('Connecting...');
        const client = await pool.connect();
        console.log('Connected!');
        client.release();
    } catch (err) {
        console.error('Connection failed:', err);
        // Print error details
        if (err instanceof Error) {
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);
        }
    } finally {
        await pool.end();
    }
}

test();
