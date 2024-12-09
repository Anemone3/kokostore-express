import { supabase } from "../../config/connection.supabase.js";
import { getUser, createUser } from "../models/user.models.js";

// // Se requiere que se envie el id de departamento desde el frontend
// export const registerUsers = async (req, res, next) => {
//   const {
//     firstname,
//     lastname,
//     correo,
//     telefono,
//     direccion,
//     password,
//     departamento,
//   } = req.body;

//   const file = req.file;

//   console.log("Datos del usuario:", req.body);
//   console.log("Archivo recibido:", file);
//   if (
//     !firstname ||
//     !lastname ||
//     !correo ||
//     !telefono ||
//     !password ||
//     !direccion ||
//     !departamento
//   ) {
//     return res.status(400).json({ error: "Todos los campos son requeridos." });
//   }
//   if (!file) {
//     return res.status(400).json({ error: "La imagen es requerida." });
//   }
//   try {
//     const filePath = `${firstname}/profile_${Date.now()}`;

//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from("profile-pictures")
//       .upload(filePath, file.buffer, {
//         cacheControl: "3600",
//         upsert: false,
//         contentType: file.mimetype,
//       });

//     if (uploadError) {
//       return res
//         .status(500)
//         .json({ error: `Error subiendo la imagen: ${uploadError.message}` });
//     }

//     console.log(`Archivo en supabase correctamente:`, uploadData);

//     const fotoUrl = supabase.storage
//       .from("profile-pictures")
//       .getPublicUrl(filePath).data.publicUrl;

//     console.log("Antes de ser  creados en la base de datos:", fo);

//     const { data, error } = await supabase.auth.signUp({
//       email: correo,
//       password: password,
//       phone: telefono,
//     });

//     if (error) return res.status(400).json({ error: error.message });

//     const { id } = data.user;

//     const user = await createUser(
//       firstname,
//       lastname,
//       correo,
//       telefono,
//       id,
//       direccion,
//       departamento,
//       fotoUrl
//     );

//     console.log("Datos del usuario:", user);

//     if (user.error) {
//       return res.status(500).json({ error: user.error });
//     }

//     res.status(201).json({ user: data.user, foto: fotoUrl });
//   } catch (error) {
//     next(error);
//   }
// };

export const registerUser = async (req, res,next) => {
  const {
    firstname,
    lastname,
    correo,
    telefono,
    direccion,
    password,
    departamento,
  } = req.body;
  const file = req.file;

  if (
    !firstname ||
    !lastname ||
    !correo ||
    !telefono ||
    !password ||
    !direccion ||
    !departamento
  ) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  try {
    if (file) {
      const validMimeTypes = ["image/jpeg", "image/png","image/webp"];
      if (!validMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error:
            "Formato de archivo no válido. Solo se permiten imágenes JPEG, PNG o GIF.",
        });
      }
    }

    // Registrar al usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: correo,
      password: password,
      phone: telefono,
    });

    if (authError) {
      return res
        .status(400)
        .json({ error: `Error al registrar usuario: ${authError.message}` });
    }

    const user = authData.user;
    if (!user) {
      return res
        .status(500)
        .json({ error: "Error al autenticar el usuario tras el registro." });
    }

    let fotoUrl = "https://s1.zerochan.net/Minato.Aqua.600.4258650.jpg"; // Asignar URL predeterminada

    if (file) {
      const filePath = `${user.id}/profile_${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.mimetype,
        });

      if (uploadError) {
        return res.status(500).json({
          error: `Error al subir la imagen: ${uploadError.message}`,
        });
      }

      fotoUrl = supabase.storage.from("profile-pictures").getPublicUrl(filePath)
        .data.publicUrl;
    }

    // Guardar el usuario en la base de datos
    const userdb = await createUser(
      firstname,
      lastname,
      correo,
      telefono,
      user.id,
      direccion,
      departamento,
      fotoUrl
    );

    console.log("Datos en la base de datos", userdb);

    return res
      .status(201)
      .json({ message: "Usuario registrado exitosamente", user: userdb });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { correo, password, telefono } = req.body;

  if (!password) {
    return res.status(400).json({ error: "La contraseña es obligatoria." });
  }

  try {
    let response;

    if (correo && !telefono) {
      response = await supabase.auth.signInWithPassword({
        email: correo,
        password: password,
      });
    } else if (telefono && !correo) {
      response = await supabase.auth.signInWithPassword({
        phone: telefono,
        password: password,
      });
    } else {
      return res
        .status(400)
        .json({ error: "El correo o teléfono son obligatorios." });
    }

    if (response.error) {
      return res.status(400).json({ error: response.error.message });
    }

    res
      .status(200)
      .json({ message: "Login exitoso", session: response.data.session });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { id_supabase } = req.params;
  if (!id_supabase) {
    return res
      .status(400)
      .json({ error: "Se necesita un parámetro válido 'id_supabase'" });
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
};
