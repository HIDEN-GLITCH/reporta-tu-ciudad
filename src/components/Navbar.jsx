import { Megaphone, Plus, Home, FileText } from 'lucide-react'

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 btn-primary rounded-xl flex items-center justify-center">
              <Megaphone className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">ReportaTuCiudad</h1>
              <p className="text-xs text-slate-500">Plataforma Ciudadana</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'home' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home size={18} />
              Inicio
            </button>
            <button
              onClick={() => setCurrentPage('reports')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'reports' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText size={18} />
              Reportes
            </button>
            <button
              onClick={() => setCurrentPage('create')}
              className="btn-primary px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2"
            >
              <Plus size={18} />
              Nuevo Reporte
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar