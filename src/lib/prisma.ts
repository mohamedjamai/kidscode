import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kidscode',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
export const db = mysql.createPool(dbConfig);

// Helper function to execute queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a single row
export async function getOne(query: string, params: any[] = []) {
  const rows = await executeQuery(query, params) as any[];
  return rows[0] || null;
}

// Helper function to get multiple rows
export async function getMany(query: string, params: any[] = []) {
  return await executeQuery(query, params) as any[];
}

// Close connection pool
export async function closeConnection() {
  await db.end();
} 