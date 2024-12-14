import { pool } from "../../config/connection.database.js";

export const executeQuery = async (query, params = []) => {
  try {
    const response = await pool.query(query, params);
    return response.rows;
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    throw new Error("Error en la consulta a la base de datos");
  }
};
