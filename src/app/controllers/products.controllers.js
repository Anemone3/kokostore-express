import ProductModel from "../models/products.models.js";
import { validationResult } from "express-validator";

// Resultado cantidad de filas y los productos
const getProducts = async (req, res) => {
  try {
    const products = {};
    const { rows } = await ProductModel.getProducts();

    rows.forEach((row) => {
      const {
        id,
        titulo,
        descripcion,
        price,
        category_id,
        image_url,
        name_category,
        ingredientes,
      } = row;

      if (!products[id]) {
        products[id] = {
          id,
          titulo,
          descripcion,
          price,
          ingredientes,
          image_url,
          category: {
            category_id,
            name_category
          },
        };
      }

    });

    const productsArray = Object.values(products);

    res
      .status(200)
      .json({ rows: productsArray.length, products: productsArray });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Informacion de un producto
const getProductById = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  try {
    const { id } = req.params;
    const { rows } = await ProductModel.getProductById(id);

    if (!rows[0]) {
      return res
        .status(404)
        .json({ error: `No se encuentra el producto solicitado` });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

//Conseguir productos segun la categoria id
const getProductCategoryId = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await ProductModel.getProductByCategoryId(id);

    if (!rows.length) {
      return res.status(404).json({ error: `No se encuentró la categoria` });
    }

    const categoria = {
      category: rows[0].name_category,
      category_id: rows[0].category_id,
      products: rows.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        descripcion: p.descripcion,
        price: p.price,
        ingredientes: p.ingredientes,
        image_url: p.image_url,
      })),
    };

    res.status(200).json(categoria);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Paginacion de productos
const getProductPaginated = () => {};

export const productController = {
  getProducts,
  getProductById,
  getProductCategoryId,
};
