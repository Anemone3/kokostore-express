import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Tipo de archivo no permitido. Solo se permiten imágenes."));
    }
    cb(null, true);
  },
});


export const fileUpload = (req, res, next) => {
  const uploadSingle = upload.single("file");

  uploadSingle(req, res, (err) => {
    if (err) {
      console.error("Error en el middleware de archivo:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "El archivo es demasiado grande.",
          message: "El tamaño máximo permitido es de 10 MB.",
        });
      }
      return res.status(400).json({
        error: "Error al procesar el archivo.",
        message: err.message,
      });
    }

    console.log("Archivo procesado correctamente:", req.file);
    next();
  });
};
