import { useState } from 'react'
import { Send, Navigation, CheckCircle, Image, X } from 'lucide-react'
import MapComponent from './MapComponent'
import axios from 'axios'

const REPORT_TYPES = [
  { id: 'bache', name: 'Bache', icon: '🕳️', color: 'bg-amber-500' },
  { id: 'iluminacion', name: 'Iluminación', icon: '💡', color: 'bg-yellow-500' },
  { id: 'basura', name: 'Basura', icon: '🗑️', color: 'bg-green-500' },
  { id: 'robo', name: 'Robo/Seguridad', icon: '⚠️', color: 'bg-red-500' },
  { id: 'agua', name: 'Agua Potable', icon: '💧', color: 'bg-blue-500' },
  { id: 'transito', name: 'Tránsito', icon: '🚦', color: 'bg-purple-500' },
  { id: 'otro', name: 'Otro', icon: '📋', color: 'bg-gray-500' }
]

function ReportForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    address: '',
    priority: 'media'
  })
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ✅ NUEVOS: Estados para imagen (RF3 - Opcional)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'El título es requerido'
    if (!formData.type) newErrors.type = 'Selecciona un tipo de reporte'
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida'
    if (!selectedLocation) newErrors.location = 'Selecciona una ubicación en el mapa'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ NUEVO: Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe pesar más de 5MB')
        return
      }
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten imágenes (JPG, PNG, GIF, WebP)')
        return
      }
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // ✅ NUEVO: Eliminar imagen seleccionada
  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  // ✅ NUEVO: Subir imagen al backend
  const uploadImage = async () => {
    if (!image) return null

    setIsUploading(true)
    const formDataImg = new FormData()
    formDataImg.append('image', image)

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setIsUploading(false)
      return response.data
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      setIsUploading(false)
      alert('Error al subir la imagen. El reporte se creará sin foto.')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // ✅ SUBIR IMAGEN SI EXISTE (OPCIONAL - RF3)
    let imageUrl = null
    let imageFilename = null
    
    if (image) {
      const uploadResult = await uploadImage()
      if (uploadResult) {
        imageUrl = uploadResult.imageUrl
        imageFilename = uploadResult.filename
      }
    }
    
    const reportData = {
      ...formData,
      lat: selectedLocation?.lat,
      lng: selectedLocation?.lng,
      status: 'pendiente',
      date: new Date().toLocaleDateString('es-MX'),
      typeIcon: REPORT_TYPES.find(t => t.id === formData.type)?.icon,
      // ✅ Campos de imagen (pueden ser null)
      imageUrl,
      imageFilename
    }
    
    onSubmit(reportData)
    setIsSubmitting(false)
  }

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setErrors(prev => ({ ...prev, location: null }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setSelectedLocation(location)
        },
        () => {
          alert('No se pudo obtener tu ubicación. Por favor selecciona manualmente en el mapa.')
        }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Título del Reporte *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.title ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Ej: Bache grande en Av. Principal"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>
      
      {/* Tipo de Problema */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tipo de Problema *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, type: type.id }))
                setErrors(prev => ({ ...prev, type: null }))
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.type === type.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-2xl block mb-1">{type.icon}</span>
              <span className="text-sm font-medium text-slate-700">{type.name}</span>
            </button>
          ))}
        </div>
        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
      </div>
      
      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            errors.description ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="Describe el problema con detalle..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
      
      {/* Prioridad */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Prioridad
        </label>
        <div className="flex gap-3">
          {['baja', 'media', 'alta'].map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority }))}
              className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all capitalize ${
                formData.priority === priority 
                  ? priority === 'alta' ? 'border-red-500 bg-red-50 text-red-700'
                  : priority === 'media' ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
      
      {/* Ubicación */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Ubicación *
        </label>
        <div className="mb-3">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Navigation size={18} />
            Usar mi ubicación actual
          </button>
        </div>
        <MapComponent 
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
        />
        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        {selectedLocation && (
          <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
            <CheckCircle size={16} />
            Ubicación seleccionada: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </p>
        )}
      </div>
      
      {/* ✅ NUEVO: Campo de Imagen (OPCIONAL - RF3) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Evidencia Fotográfica <span className="text-slate-400 font-normal">(Opcional)</span>
        </label>
        
        <div className="flex items-center gap-3">
          <label className="flex-1 cursor-pointer">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
              <Image className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600 font-medium">
                {image ? image.name : 'Click para seleccionar una imagen'}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG, GIF, WebP (Máx 5MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview de imagen */}
        {imagePreview && (
          <div className="mt-4 relative">
            <img 
              src={imagePreview} 
              alt="Vista previa" 
              className="w-full h-48 object-cover rounded-xl border-2 border-slate-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Eliminar imagen"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Estado de subida */}
        {isUploading && (
          <p className="text-blue-600 text-sm mt-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Subiendo imagen...
          </p>
        )}
      </div>
      
      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 border-2 border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-primary py-3 px-6 rounded-xl font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send size={18} />
              Enviar Reporte
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ReportForm