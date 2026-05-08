import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app, connectDB } from '../app.js'
import Report from '../models/Report.js'

// Servidor MongoDB en memoria para tests
let mongoServer

// Configurar antes de todos los tests
beforeAll(async () => {
  // Crear servidor MongoDB en memoria
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  
  // Conectar Mongoose al servidor en memoria
  await connectDB(mongoUri)
})

// Limpiar base de datos después de cada test
afterEach(async () => {
  await Report.deleteMany({})
})

// Cerrar conexión después de todos los tests
afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

// ============================================
// TESTS PARA API DE REPORTES
// ============================================

describe('📋 API de Reportes - POST /api/reports', () => {
  
  test('✅ Debe crear un reporte exitosamente', async () => {
    const nuevoReporte = {
      title: 'Bache peligroso',
      type: 'bache',
      description: 'Bache de 50cm en la calle',
      address: 'Av. Principal #123',
      lat: 19.4326,
      lng: -99.1332,
      priority: 'alta'
    }

    const response = await request(app)
      .post('/api/reports')
      .send(nuevoReporte)
      .expect(201)

    expect(response.body).toHaveProperty('_id')
    expect(response.body.title).toBe(nuevoReporte.title)
    expect(response.body.status).toBe('pendiente')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
  })

  test('❌ Debe fallar si falta el título', async () => {
    const reporteSinTitulo = {
      type: 'bache',
      description: 'Sin título'
    }

    const response = await request(app)
      .post('/api/reports')
      .send(reporteSinTitulo)
      .expect(400)

    expect(response.body).toHaveProperty('message')
  })

  test('❌ Debe fallar si falta el tipo', async () => {
    const reporteSinTipo = {
      title: 'Test',
      description: 'Sin tipo'
    }

    const response = await request(app)
      .post('/api/reports')
      .send(reporteSinTipo)
      .expect(400)

    expect(response.body).toHaveProperty('message')
  })

  test('✅ Debe crear reporte sin imagen (opcional)', async () => {
    const reporteSinImagen = {
      title: 'Test sin foto',
      type: 'basura',
      description: 'Sin evidencia fotográfica',
      address: 'Calle Test',
      lat: 19.4300,
      lng: -99.1300
    }

    const response = await request(app)
      .post('/api/reports')
      .send(reporteSinImagen)
      .expect(201)

    expect(response.body.imageUrl).toBeNull()
    expect(response.body.imageFilename).toBeNull()
  })

  test('✅ Debe crear reporte con imagen (opcional)', async () => {
    const reporteConImagen = {
      title: 'Test con foto',
      type: 'iluminacion',
      description: 'Con evidencia',
      address: 'Calle Test',
      lat: 19.4300,
      lng: -99.1300,
      imageUrl: 'http://localhost:5000/uploads/test.jpg',
      imageFilename: 'test.jpg'
    }

    const response = await request(app)
      .post('/api/reports')
      .send(reporteConImagen)
      .expect(201)

    expect(response.body.imageUrl).toBe(reporteConImagen.imageUrl)
    expect(response.body.imageFilename).toBe(reporteConImagen.imageFilename)
  })
})

describe('📋 API de Reportes - GET /api/reports', () => {
  
  beforeEach(async () => {
    await Report.create([
      {
        title: 'Reporte 1',
        type: 'bache',
        description: 'Descripción 1',
        address: 'Dirección 1',
        location: { lat: 19.4326, lng: -99.1332 },
        status: 'pendiente'
      },
      {
        title: 'Reporte 2',
        type: 'basura',
        description: 'Descripción 2',
        address: 'Dirección 2',
        location: { lat: 19.4350, lng: -99.1400 },
        status: 'proceso'
      }
    ])
  })

  test('✅ Debe obtener todos los reportes', async () => {
    const response = await request(app)
      .get('/api/reports')
      .expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBe(2)
    expect(response.body[0]).toHaveProperty('title')
    expect(response.body[0]).toHaveProperty('createdAt')
  })

  test('✅ Los reportes deben estar ordenados por fecha', async () => {
  const response = await request(app)
    .get('/api/reports')
    .expect(200)

  expect(response.body.length).toBe(2)
  
  // ✅ Comparar timestamps (números) en lugar de objetos Date
  const date0 = new Date(response.body[0].createdAt).getTime()
  const date1 = new Date(response.body[1].createdAt).getTime()
  
  expect(date0).toBeGreaterThanOrEqual(date1)
})
})


describe('📋 API de Reportes - PUT /api/reports/:id', () => {
  
  let createdReport

  beforeEach(async () => {
    createdReport = await Report.create({
      title: 'Reporte para actualizar',
      type: 'bache',
      description: 'Descripción original',
      status: 'pendiente',
      address: 'Dirección',
      location: { lat: 19.4326, lng: -99.1332 }
    })
  })

  test('✅ Debe actualizar el estado del reporte', async () => {
    const response = await request(app)
      .put(`/api/reports/${createdReport._id}`)
      .send({ status: 'proceso' })
      .expect(200)

    expect(response.body.status).toBe('proceso')
  })

  test('✅ Debe actualizar la imagen del reporte', async () => {
    const response = await request(app)
      .put(`/api/reports/${createdReport._id}`)
      .send({ 
        imageUrl: 'http://localhost:5000/uploads/nueva.jpg',
        imageFilename: 'nueva.jpg'
      })
      .expect(200)

    expect(response.body.imageUrl).toBe('http://localhost:5000/uploads/nueva.jpg')
  })
})

describe('📋 API de Reportes - DELETE /api/reports/:id', () => {
  
  let createdReport

  beforeEach(async () => {
    createdReport = await Report.create({
      title: 'Reporte para eliminar',
      type: 'bache',
      description: 'Descripción',
      address: 'Dirección',
      location: { lat: 19.4326, lng: -99.1332 }
    })
  })

  test('✅ Debe eliminar un reporte', async () => {
    const response = await request(app)
      .delete(`/api/reports/${createdReport._id}`)
      .expect(200)

    expect(response.body).toHaveProperty('message')
    
    const found = await Report.findById(createdReport._id)
    expect(found).toBeNull()
  })
})

describe('📋 Modelo Report - Validaciones', () => {
  
  test('✅ Debe crear un reporte válido', async () => {
    const report = new Report({
      title: 'Test completo',
      type: 'bache',
      description: 'Descripción completa',
      address: 'Dirección completa',
      location: { lat: 19.4326, lng: -99.1332 },
      priority: 'alta',
      status: 'pendiente'
    })

    const saved = await report.save()
    expect(saved._id).toBeDefined()
    expect(saved.createdAt).toBeDefined()
  })

  test('❌ Debe fallar sin título', async () => {
    const report = new Report({
      type: 'bache',
      description: 'Sin título'
    })

    await expect(report.save()).rejects.toThrow()
  })

  test('✅ Debe aceptar tipos válidos', async () => {
    const tiposValidos = ['bache', 'iluminacion', 'basura', 'robo', 'agua', 'transito', 'otro']
    
    for (const tipo of tiposValidos) {
      const report = new Report({
        title: `Test ${tipo}`,
        type: tipo,
        description: 'Tipo válido'
      })
      
      const saved = await report.save()
      expect(saved.type).toBe(tipo)
      await Report.findByIdAndDelete(saved._id)
    }
  })
})