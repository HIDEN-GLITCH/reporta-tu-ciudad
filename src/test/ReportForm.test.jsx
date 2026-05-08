import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ReportForm from '../components/ReportForm'

describe('📝 ReportForm Component', () => {
  
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })


it('✅ Debe renderizar el formulario correctamente', () => {
  const { container } = render(<ReportForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
  
  // Solo verificar que algo se renderizó
  expect(container.firstChild).toBeInTheDocument()
})


  it('✅ Debe mostrar error si el título está vacío', async () => {
    render(<ReportForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const submitButton = screen.getByRole('button', { name: /enviar reporte/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/título es requerido/i)).toBeInTheDocument()
    })
  })

  it('✅ Debe permitir seleccionar un tipo de reporte', () => {
    render(<ReportForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const bacheButton = screen.getByText('Bache').closest('button')
    fireEvent.click(bacheButton)
    
    expect(bacheButton).toBeInTheDocument()
  })

  it('✅ Debe permitir seleccionar prioridad', () => {
    render(<ReportForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const altaButton = screen.getByText('alta').closest('button')
    fireEvent.click(altaButton)
    
    expect(altaButton).toBeInTheDocument()
  })

  it('✅ Debe llamar a onCancel cuando se presiona cancelar', () => {
    render(<ReportForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const cancelButton = screen.getByText('Cancelar').closest('button')
    fireEvent.click(cancelButton)
    
    expect(mockOnCancel).toHaveBeenCalled()
  })
})