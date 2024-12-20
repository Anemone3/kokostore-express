import { pool } from "../../config/connection.database.js";

// Función auxiliar para ejecutar consultas
const executeQuery = async (query, params = []) => {
  try {
    const response = await pool.query(query, params);
    return response;
  } catch (error) {
    console.error("Error en la consulta a la base de datos:", error);
    throw new Error("Error en la consulta a la base de datos");
  }
};

// Obtener todos los productos
const getProducts = async () => {
  const query = `
        SELECT p.id, p.titulo, p.descripcion, p.price, p.image_url,p.ingredientes,  c.id as category_id, c.name_category
        FROM products p
        JOIN category c ON p.category = c.id
    `;
  return await executeQuery(query);
};

// Obtener producto por ID
const getProductById = async (id) => {
  const query = `SELECT p.id, p.titulo, p.descripcion, p.price, p.image_url , p.ingredientes, c.id as category_id, c.name_category, p.stock FROM products p JOIN category c ON p.category = c.id  WHERE p.id = $1`;
  return await executeQuery(query, [id]);
};

// Obtener productos por ID de categoría
const getProductByCategoryId = async (categoria) => {
  const query = `
        SELECT p.id, p.titulo, p.descripcion, p.price,p.image_url, p.ingredientes, c.id as category_id, c.name_category
        FROM products p
        JOIN category c ON p.category = c.id
        WHERE c.id = $1
    `;
  return await executeQuery(query, [categoria]);
};

const getProductPaginated = async (limit, offset) => {
    const query = "SELECT * FROM products LIMIT $1 OFFSET $2"

    return await executeQuery(query,[limit,offset])
};

export default {
  getProducts,
  getProductById,
  getProductByCategoryId,
  getProductPaginated,
};
