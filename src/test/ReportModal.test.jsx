import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ReportModal from '../components/ReportModal'

describe('📋 ReportModal Component', () => {
  
  const mockOnClose = vi.fn()
  const mockOnUpdateStatus = vi.fn()

  const mockReport = {
    id: '1',
    title: 'Bache peligroso',
    type: 'bache',
    description: 'Bache de 50cm en la calle',
    status: 'pendiente',
    date: '15/01/2025',
    address: 'Av. Principal #123',
    priority: 'alta',
    lat: 19.4326,
    lng: -99.1332
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('✅ No debe renderizarse si isOpen es false', () => {
    const { container } = render(
      <ReportModal isOpen={false} onClose={mockOnClose} report={mockReport} onUpdateStatus={mockOnUpdateStatus} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('✅ Debe mostrar el título del reporte', () => {
    render(<ReportModal isOpen={true} onClose={mockOnClose} report={mockReport} onUpdateStatus={mockOnUpdateStatus} />)
    expect(screen.getByText('Bache peligroso')).toBeInTheDocument()
  })

  it('✅ Debe mostrar la descripción', () => {
    render(<ReportModal isOpen={true} onClose={mockOnClose} report={mockReport} onUpdateStatus={mockOnUpdateStatus} />)
    expect(screen.getByText('Bache de 50cm en la calle')).toBeInTheDocument()
  })

 it('✅ Debe llamar a onClose cuando se presiona X', () => {
  render(<ReportModal isOpen={true} onClose={mockOnClose} report={mockReport} onUpdateStatus={mockOnUpdateStatus} />)
  
  // Buscar el botón por su función (close button)
  const closeButton = screen.getByRole('button', { name: '' })
  fireEvent.click(closeButton)
  
  expect(mockOnClose).toHaveBeenCalled()
})


  it('✅ Debe llamar a onUpdateStatus cuando se cambia estado', () => {
    render(<ReportModal isOpen={true} onClose={mockOnClose} report={mockReport} onUpdateStatus={mockOnUpdateStatus} />)
    const procesoButton = screen.getByText('En Proceso').closest('button')
    fireEvent.click(procesoButton)
    expect(mockOnUpdateStatus).toHaveBeenCalledWith('1', 'proceso')
  })

  it('✅ No debe mostrar imagen si no hay imageUrl', () => {
    const reportSinImagen = { ...mockReport, imageUrl: null }
    render(<ReportModal isOpen={true} onClose={mockOnClose} report={reportSinImagen} onUpdateStatus={mockOnUpdateStatus} />)
    expect(screen.queryByText(/evidencia fotográfica/i)).not.toBeInTheDocument()
  })

  it('✅ Debe mostrar imagen si existe imageUrl', () => {
    const reportConImagen = { 
      ...mockReport, 
      imageUrl: 'http://localhost:5000/uploads/test.jpg',
      imageFilename: 'test.jpg'
    }
    render(<ReportModal isOpen={true} onClose={mockOnClose} report={reportConImagen} onUpdateStatus={mockOnUpdateStatus} />)
    expect(screen.getByText(/evidencia fotográfica/i)).toBeInTheDocument()
  })
})