import { MapPin, Calendar } from 'lucide-react'

const REPORT_TYPES = {
  bache: { icon: '🕳️', name: 'Bache', color: 'bg-amber-500' },
  iluminacion: { icon: '💡', name: 'Iluminación', color: 'bg-yellow-500' },
  basura: { icon: '🗑️', name: 'Basura', color: 'bg-green-500' },
  robo: { icon: '⚠️', name: 'Robo/Seguridad', color: 'bg-red-500' },
  agua: { icon: '💧', name: 'Agua Potable', color: 'bg-blue-500' },
  transito: { icon: '🚦', name: 'Tránsito', color: 'bg-purple-500' },
  otro: { icon: '📋', name: 'Otro', color: 'bg-gray-500' }
}

const STATUS_OPTIONS = {
  pendiente: { name: 'Pendiente', class: 'status-pendiente' },
  proceso: { name: 'En Proceso', class: 'status-proceso' },
  resuelto: { name: 'Resuelto', class: 'status-resuelto' }
}

function ReportCard({ report, onClick }) {
  const reportType = REPORT_TYPES[report.type] || REPORT_TYPES.otro
  const status = STATUS_OPTIONS[report.status] || STATUS_OPTIONS.pendiente

  return (
    <div 
      onClick={() => onClick(report)}
      className="card-hover bg-white rounded-xl p-5 shadow-md cursor-pointer border border-slate-100 fade-in"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{reportType.icon}</span>
          <div>
            <h3 className="font-semibold text-slate-800">{report.title}</h3>
            <p className="text-sm text-slate-500">{reportType.name}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.class}`}>
          {status.name}
        </span>
      </div>
      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{report.description}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{report.address || 'Ubicación en mapa'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{report.date}</span>
        </div>
      </div>
    </div>
  )
}

export default ReportCard