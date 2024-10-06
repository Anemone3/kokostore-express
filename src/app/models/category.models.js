import { pool } from "../../config/connection.database.js";

    const executeQuery = async (query, params = []) => {
        try {
            const response = await pool.query(query, params);
            return response; 
        } catch (error) {
            console.error("Error en la consulta a la base de datos:", error);
            throw new Error('Error en la consulta a la base de datos');
        }
    };

    // conseguir todas las categorias
    const getCategories = async()=>{
        const query = 'SELECT * FROM category';

        return await executeQuery(query);
    }



export default {
    getCategories
}