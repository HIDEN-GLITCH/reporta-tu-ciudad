import dotenv from 'dotenv'
import { app, connectDB } from './app.js'

dotenv.config()

const PORT = process.env.PORT || 5000

// Solo conectar y escuchar en producción/desarrollo (NO en tests)
if (process.env.NODE_ENV !== 'test') {
  connectDB(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ Conectado a MongoDB')
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      })
    })
    .catch((error) => {
      console.error('❌ Error conectando a MongoDB:', error)
      process.exit(1)
    })
}