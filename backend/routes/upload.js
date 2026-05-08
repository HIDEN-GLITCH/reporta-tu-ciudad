import express from 'express'
import upload from '../middleware/upload.js'

const router = express.Router()

// POST - Subir imagen
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' })
    }

    // URL para acceder a la imagen
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`

    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
