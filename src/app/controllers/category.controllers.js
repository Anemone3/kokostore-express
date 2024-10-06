import CategoryModel from "../models/category.models.js";


    const getCategories = async(req,res)=>{
        try {

            const { rows } = await CategoryModel.getCategories();

            if(!rows.length){
                return res.status(404).json({error: 'No se encontraron categorías'})
            }

            res.status(200).json(rows)

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las categorias' });
        }
    }


    export default  {
        getCategories
    }