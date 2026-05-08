import express from 'express'
import Report from '../models/Report.js'

const router = express.Router()

// ============================================
// GET - Obtener todos los reportes
// ============================================
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============================================
// GET - Obtener un reporte por ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return res.status(404).json({ message: 'Reporte no encontrado' })
    res.json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============================================
// POST - Crear nuevo reporte (RF3 + RF5)
// ============================================
router.post('/', async (req, res) => {
  try {
    const report = new Report({
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      address: req.body.address,
      location: {
        lat: req.body.lat,
        lng: req.body.lng
      },
      priority: req.body.priority || 'media',
      status: req.body.status || 'pendiente',
      // Campos OPCIONALES para imagen 
      imageUrl: req.body.imageUrl || null,
      imageFilename: req.body.imageFilename || null
    })

    const newReport = await report.save()
    res.status(201).json(newReport)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// ============================================
// PUT - Actualizar reporte (incluye estado e imagen)
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return res.status(404).json({ message: 'Reporte no encontrado' })

    // Campos actualizables
    if (req.body.title !== undefined) report.title = req.body.title
    if (req.body.type !== undefined) report.type = req.body.type
    if (req.body.description !== undefined) report.description = req.body.description
    if (req.body.address !== undefined) report.address = req.body.address
    
    if (req.body.lat !== undefined) report.location.lat = req.body.lat
    if (req.body.lng !== undefined) report.location.lng = req.body.lng
    
    if (req.body.priority !== undefined) report.priority = req.body.priority
    if (req.body.status !== undefined) report.status = req.body.status
    
    // ✅ Campos OPCIONALES de imagen (pueden ser null para quitar foto)
    if (req.body.imageUrl !== undefined) report.imageUrl = req.body.imageUrl
    if (req.body.imageFilename !== undefined) report.imageFilename = req.body.imageFilename

    const updatedReport = await report.save()
    res.json(updatedReport)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// ============================================
// DELETE - Eliminar reporte
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return res.status(404).json({ message: 'Reporte no encontrado' })

    await Report.findByIdAndDelete(req.params.id)
    res.json({ message: 'Reporte eliminado', id: req.params.id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router