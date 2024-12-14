import CategoryModel from "../models/category.models.js";

const getCategories = async (req, res) => {
  try {
    const response = await CategoryModel.getCategories();

    if (!response.length) {
      return res.status(404).json({ error: "No se encontraron categorías" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las categorias" });
  }
};

export default {
  getCategories,
};
