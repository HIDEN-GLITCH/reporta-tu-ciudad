import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import reportRoutes from './routes/reports.js'
import uploadRoutes from './routes/upload.js'

// Para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Crear app Express
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas
app.use('/api/reports', reportRoutes)
app.use('/api/upload', uploadRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🚀 API de ReportaTuCiudad funcionando' })
})

// Función para conectar a MongoDB (exportada para usar en tests o production)
export const connectDB = async (uri) => {
  return mongoose.connect(uri)
}

// Exportar app para tests
export { app }
export default app
