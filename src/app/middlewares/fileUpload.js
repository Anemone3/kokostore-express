import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

export const fileUpload = (req, res, next) => {
  const uploadSingle = upload.single("file");

  uploadSingle(req, res, (err) => {
    if (err) {
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

    next();
  });
};
