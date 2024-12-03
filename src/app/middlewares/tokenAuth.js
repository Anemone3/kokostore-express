
import { supabase } from "../../config/connection.supabase.js"

export const verifyToken = async(req,res,next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado o inválido" });
        }

        const token = authHeader.split(" ")[1];
        
        if (!token || token.trim() === "") {
        return res.status(401).json({ error: "Token vacío o inválido" });
        }

        const {data,error} = await supabase.auth.getUser(token);

        if (error) {
            console.error("Supabase auth error:", error.message);  
            return res.status(401).json({ error: "Usuario no autorizado" });
        }

        if (!data?.user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }
        
        //Uso para un siguiente middleware
        req.user = data.user;
        next();
    } catch (error) {
        console.error("Error en el middleware de autenticación:", err.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}