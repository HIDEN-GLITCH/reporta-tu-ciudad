import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Obtener directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Crear carpeta uploads si no existe
    const uploadsDir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + nombre original
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'))
  }
}

// Configurar multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: fileFilter
})

export default upload
