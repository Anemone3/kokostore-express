// conseguir todas las categorias
export const getCategories = async () => {
  const query = "SELECT * FROM category";

  return await executeQuery(query);
};

export default {
  getCategories,
};
