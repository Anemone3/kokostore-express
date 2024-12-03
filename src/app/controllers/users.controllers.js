import { supabase } from '../../config/connection.supabase.js'
import {getUser, createUser} from '../models/user.models.js'



// Se requiere que se envie el id de departamento desde el frontend
export const registerUser = async(req,res,next) =>{
    const {firstname,lastname,correo,telefono,direccion, password} = req.body;
    const departamento = 13;
    if (!firstname || !lastname || !correo || !telefono || !password || !direccion || !departamento) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    try {
        const {data,error} = await supabase.auth.signUp({
        email: correo,
        password: password,
        phone: telefono
    })

    if (error) return res.status(400).json({ error: error.message });


    const { id } = data.user;

    const user = await createUser(firstname,lastname,correo,telefono,id,direccion,departamento);

    if(user.error){
        res.status(500).json({error: user.error})
    }

    res.status(201).json({user: data.user});
    } catch (error) {
        next(error)
    }

}


export const loginUser = async(req,res,next)=>{
    const {correo, password,telefono} = req.body;


    
    if (!password) {
        return res.status(400).json({ error: 'La contraseña es obligatoria.' });
    }


    try {
        
        let response;

        if(correo && !telefono){
            response = await supabase.auth.signInWithPassword({
            email: correo,
            password: password,  
            })
        }else if(telefono && !correo){
            response = await supabase.auth.signInWithPassword({
            phone: telefono,
            password: password,  
            })
        }else{
            return res.status(400).json({ error: 'El correo o teléfono son obligatorios.' });
        }

        if(response.error){
            return res.status(400).json({ error: response.error.message });
        }
        
        res.status(200).json({message:'Login exitoso', session: response.data.session})

    } catch (error) {
        next(error);
    }

}

export const getUserById = async(req,res,next)=>{
    const { id_supabase } = req.params;
    if(!id_supabase){
        return res.status(400).json({ error: "Se necesita un parámetro válido 'id_supabase'" });
    }

  try {
    const user = await getUser(id_supabase);

    if (user.error) {
        return res.status(404).json({ error: user.error });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}