import { PlusCircle, ArrowRight, Inbox } from 'lucide-react'
import ReportCard from '../components/ReportCard'

const REPORT_TYPES = [
  { id: 'bache', name: 'Bache', icon: '🕳️' },
  { id: 'iluminacion', name: 'Iluminación', icon: '💡' },
  { id: 'basura', name: 'Basura', icon: '🗑️' },
  { id: 'robo', name: 'Robo/Seguridad', icon: '⚠️' },
  { id: 'agua', name: 'Agua Potable', icon: '💧' },
  { id: 'transito', name: 'Tránsito', icon: '🚦' },
  { id: 'otro', name: 'Otro', icon: '📋' }
]

function Home({ reports, setCurrentPage, handleReportClick }) {
  const stats = {
    total: reports.length,
    pendiente: reports.filter(r => r.status === 'pendiente').length,
    proceso: reports.filter(r => r.status === 'proceso').length,
    resuelto: reports.filter(r => r.status === 'resuelto').length
  }

  return (
    <div className="space-y-8 fade-in">
      <div className="text-center py-12">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Tu voz hace la diferencia
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Reporta problemas en tu ciudad y ayuda a mejorar la comunidad. 
          Juntos podemos construir un mejor lugar para vivir.
        </p>
        <button
          onClick={() => setCurrentPage('create')}
          className="btn-primary px-8 py-4 rounded-xl font-semibold text-white text-lg flex items-center gap-3 mx-auto"
        >
          <PlusCircle size={24} />
          Crear Nuevo Reporte
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          <p className="text-slate-500">Total Reportes</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow-md text-center">
          <p className="text-3xl font-bold text-amber-700">{stats.pendiente}</p>
          <p className="text-amber-600">Pendientes</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md text-center">          <p className="text-3xl font-bold text-blue-700">{stats.proceso}</p>
          <p className="text-blue-600">En Proceso</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md text-center">
          <p className="text-3xl font-bold text-green-700">{stats.resuelto}</p>
          <p className="text-green-600">Resueltos</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Tipos de Reportes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {REPORT_TYPES.map((type) => (
            <div key={type.id} className="bg-white rounded-xl p-4 shadow-md text-center card-hover">
              <span className="text-4xl block mb-2">{type.icon}</span>
              <p className="font-medium text-slate-700">{type.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Reportes Recientes</h3>
          <button
            onClick={() => setCurrentPage('reports')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            Ver todos
            <ArrowRight size={18} />
          </button>
        </div>
        {reports.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.slice(0, 6).map((report) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onClick={handleReportClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <Inbox size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg mb-4">No hay reportes aún</p>
            <button
              onClick={() => setCurrentPage('create')}
              className="btn-primary px-6 py-3 rounded-xl font-medium text-white inline-flex items-center gap-2"
            >              <PlusCircle size={18} />
              Sé el primero en reportar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home