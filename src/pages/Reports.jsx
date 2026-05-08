import { useState } from 'react'
import { Plus, Map, Inbox } from 'lucide-react'
import ReportCard from '../components/ReportCard'
import MapComponent from '../components/MapComponent'

const REPORT_TYPES = [
  { id: 'bache', name: 'Bache' },
  { id: 'iluminacion', name: 'Iluminación' },
  { id: 'basura', name: 'Basura' },
  { id: 'robo', name: 'Robo/Seguridad' },
  { id: 'agua', name: 'Agua Potable' },
  { id: 'transito', name: 'Tránsito' },
  { id: 'otro', name: 'Otro' }
]

const STATUS_OPTIONS = [
  { id: 'todos', name: 'Todos los estados' },
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'proceso', name: 'En Proceso' },
  { id: 'resuelto', name: 'Resuelto' }
]

function Reports({ reports, handleReportClick }) {
  const [filterStatus, setFilterStatus] = useState('todos')
  const [filterType, setFilterType] = useState('todos')

  const filteredReports = reports.filter(report => {
    if (filterStatus !== 'todos' && report.status !== filterStatus) return false
    if (filterType !== 'todos' && report.type !== filterType) return false
    return true
  })

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Todos los Reportes</h2>
        <button
          onClick={() => window.location.href = '#create'}
          className="btn-primary px-6 py-3 rounded-xl font-medium text-white flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Reporte
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los tipos</option>
              {REPORT_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Map size={20} />
          Mapa de Reportes
        </h3>
        <MapComponent reports={reports} />
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              onClick={handleReportClick}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
            <Inbox size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">No hay reportes que coincidan con los filtros</p>          </div>
        )}
      </div>
    </div>
  )
}

export default Reports