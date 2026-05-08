import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'El título es requerido'] 
  },
  type: { 
    type: String, 
    required: [true, 'El tipo es requerido'],
    enum: ['bache', 'iluminacion', 'basura', 'robo', 'agua', 'transito', 'otro']
  },
  description: { 
    type: String, 
    required: [true, 'La descripción es requerida'] 
  },
  address: String,
  location: {
    lat: Number,
    lng: Number
  },
  priority: { 
    type: String, 
    default: 'media',
    enum: ['baja', 'media', 'alta']
  },
  status: { 
    type: String, 
    default: 'pendiente',
    enum: ['pendiente', 'proceso', 'resuelto']
  },
  imageUrl: String,  // ✅ OPCIONAL - Sin required
  imageFilename: String  // ✅ Para referencia
}, { 
  timestamps: true
})

export default mongoose.model('Report', reportSchema)