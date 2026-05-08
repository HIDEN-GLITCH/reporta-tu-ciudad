import ReportForm from '../components/ReportForm'

function CreateReport({ onSubmit, onCancel }) {
  return (
    <div className="max-w-3xl mx-auto fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Crear Nuevo Reporte</h2>
          <p className="text-slate-600">Completa el formulario para reportar un problema en tu ciudad</p>
        </div>
        <ReportForm 
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  )
}

export default CreateReport
