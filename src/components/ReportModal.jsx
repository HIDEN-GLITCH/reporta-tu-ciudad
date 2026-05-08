import { X, MapPin, Calendar, Flag, Share2, Image } from 'lucide-react'

const REPORT_TYPES = {
  bache: { icon: '🕳️', name: 'Bache' },
  iluminacion: { icon: '💡', name: 'Iluminación' },
  basura: { icon: '🗑️', name: 'Basura' },
  robo: { icon: '⚠️', name: 'Robo/Seguridad' },
  agua: { icon: '💧', name: 'Agua Potable' },
  transito: { icon: '🚦', name: 'Tránsito' },
  otro: { icon: '📋', name: 'Otro' }
}

const STATUS_OPTIONS = {
  pendiente: { name: 'Pendiente', class: 'status-pendiente' },
  proceso: { name: 'En Proceso', class: 'status-proceso' },
  resuelto: { name: 'Resuelto', class: 'status-resuelto' }
}

function ReportModal({ isOpen, onClose, report, onUpdateStatus }) {
  if (!isOpen || !report) return null

  const reportType = REPORT_TYPES[report.type] || REPORT_TYPES.otro
  const status = STATUS_OPTIONS[report.status] || STATUS_OPTIONS.pendiente

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-slate-800">Detalle del Reporte</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Título y estado */}
          <div className="flex items-start gap-4">
            <span className="text-5xl">{reportType.icon}</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{report.title}</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                  {status.name}
                </span>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {report.date}
                </span>
              </div>
            </div>
          </div>
          
          {/* Descripción */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="font-semibold text-slate-700 mb-2">Descripción</h4>
            <p className="text-slate-600">{report.description}</p>
          </div>

          {/* ✅ NUEVO: Evidencia Fotográfica (RF3 - Opcional) */}
          {report.imageUrl && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Image size={18} />
                Evidencia Fotográfica
              </h4>
              <div className="rounded-xl overflow-hidden border-2 border-slate-200">
                <img 
                  src={report.imageUrl} 
                  alt="Evidencia del reporte" 
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible'
                    e.target.alt = 'Imagen no disponible'
                  }}
                />
              </div>
              {report.imageFilename && (
                <p className="text-xs text-slate-400 mt-1">
                  Archivo: {report.imageFilename}
                </p>
              )}
            </div>
          )}
          
          {/* Ubicación y Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin size={18} />
                Ubicación
              </h4>
              <p className="text-slate-600">{report.address || 'Ver en mapa'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Flag size={18} />
                Prioridad
              </h4>
              <p className={`font-medium capitalize ${
                report.priority === 'alta' ? 'text-red-600' :
                report.priority === 'media' ? 'text-yellow-600' : 'text-green-600'
              }`}>{report.priority}</p>
            </div>
          </div>
          
          {/* Mapa pequeño con coordenadas */}
          {report.lat && report.lng && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Ubicación en Mapa</h4>
              <div className="map-container" style={{ height: '250px' }}>
                <div className="bg-slate-100 h-full flex items-center justify-center rounded-xl">
                  <p className="text-slate-500">📍 {report.lat.toFixed(4)}, {report.lng.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Actualizar Estado */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-semibold text-slate-700 mb-3">Actualizar Estado</h4>
            <div className="flex gap-3">
              {Object.entries(STATUS_OPTIONS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => onUpdateStatus(report.id, key)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    report.status === key 
                      ? value.class + ' ring-2 ring-offset-2 ring-blue-500'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Reporte #${report.id}: ${report.title}`)
                alert('Enlace copiado al portapapeles')
              }}
              className="flex-1 btn-primary py-3 px-6 rounded-xl font-medium text-white flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportModal
