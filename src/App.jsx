import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Reports from './pages/Reports'
import CreateReport from './pages/CreateReport'
import ReportModal from './components/ReportModal'
import { getReports, createReport as apiCreateReport, updateReport as apiUpdateReport } from './services/api'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [reports, setReports] = useState([]) // ✅ Inicia vacío, se carga del backend
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Cargar reportes del backend al iniciar
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true)
        const data = await getReports()
        // Transformar _id → id para compatibilidad con el frontend
        const formatted = data.map(report => ({
          ...report,
          id: report._id,
          lat: report.location?.lat,
          lng: report.location?.lng,
          typeIcon: getTypeIcon(report.type),
          date: formatDate(report.createdAt)
        }))
        setReports(formatted)
      } catch (error) {
        console.error('Error cargando reportes:', error)
        // Fallback: datos de ejemplo si falla la API
        setReports([
          {
            id: '1',
            title: 'Bache peligroso en Av. Reforma',
            type: 'bache',
            typeIcon: '🕳️',
            description: 'Bache de aproximadamente 50cm de diámetro.',
            status: 'pendiente',
            date: '15/01/2025',
            address: 'Av. Reforma #123',
            priority: 'alta',
            lat: 19.4326,
            lng: -99.1332
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  // Función auxiliar para íconos
  const getTypeIcon = (type) => {
    const icons = {
      bache: '🕳️', iluminacion: '💡', basura: '🗑️',
      robo: '⚠️', agua: '💧', transito: '🚦', otro: '📋'
    }
    return icons[type] || '📋'
  }

  // Función auxiliar para formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('es-MX')
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  //  Crear reporte en backend
  const handleNewReport = async (reportData) => {
    try {
      const newReport = await apiCreateReport({
        title: reportData.title,
        type: reportData.type,
        description: reportData.description,
        address: reportData.address,
        lat: reportData.lat,
        lng: reportData.lng,
        priority: reportData.priority,
        status: 'pendiente'
      })
      
      // Transformar para el frontend
      const formatted = {
        ...newReport,
        id: newReport._id,
        lat: newReport.location?.lat,
        lng: newReport.location?.lng,
        typeIcon: getTypeIcon(newReport.type),
        date: formatDate(newReport.createdAt)
      }
      
      setReports(prev => [formatted, ...prev])
      setCurrentPage('reports')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error creando reporte:', error)
      alert('Error al crear reporte: ' + error.message)
    }
  }

  const handleReportClick = (report) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  //  Actualizar estado en backend
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      // Actualizar en backend
      await apiUpdateReport(reportId, { status: newStatus })
      
      // Actualizar en frontend
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: newStatus } : r
      ))
      if (selectedReport?.id === reportId) {
        setSelectedReport(prev => ({ ...prev, status: newStatus }))
      }
    } catch (error) {
      console.error('Error actualizando estado:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
      
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 fade-in">
          <span className="text-2xl">✅</span>
          <span className="font-medium">¡Reporte enviado exitosamente!</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && (
          <Home 
            reports={reports} 
            setCurrentPage={setCurrentPage}
            handleReportClick={handleReportClick}
          />
        )}
        {currentPage === 'reports' && (
          <Reports 
            reports={reports} 
            handleReportClick={handleReportClick}
          />
        )}
        {currentPage === 'create' && (
          <CreateReport 
            onSubmit={handleNewReport}
            onCancel={() => setCurrentPage('home')}
          />
        )}
      </main>

      <ReportModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
        onUpdateStatus={updateReportStatus}
      />
    </div>
  )
}

export default App