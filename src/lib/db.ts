import mysql from 'mysql2/promise';

export async function query({
  query,
  values = []
}: {
  query: string;
  values?: any[];
}) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
} 