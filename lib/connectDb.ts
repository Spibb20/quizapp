import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRE_KEY,
});

export const query = async (query: string, params?: string[]) => {
  const res = await pool.query(query, params);
  return res;
};
