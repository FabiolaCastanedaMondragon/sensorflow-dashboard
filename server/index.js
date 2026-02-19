// ============================================
// BACKEND: API REST con Express
// ============================================

const express = require('express');      // Framework web para Node.js
const cors = require('cors');            // Permite conexión con el frontend
const bodyParser = require('body-parser'); // Procesa JSON

const app = express();                   // Creamos la app
const PORT = 3001;                       // Puerto del servidor

// --- MIDDLEWARES ---
app.use(cors());
app.use(bodyParser.json());

// --- BASE DE DATOS SIMULADA ---
let sensores = [
    { id: 1, nombre: 'Sensor Sala', tipo: 'Temperatura', valor: 24 },
    { id: 2, nombre: 'Sensor Cocina', tipo: 'Humedad', valor: 60 },
    { id: 3, nombre: 'Sensor Jardín', tipo: 'Luz', valor: 85 }
];

// ============================================
// RUTAS
// ============================================

// Obtener todos los sensores
app.get('/api/sensores', (req, res) => {
    res.json(sensores);
});

// Crear sensor
app.post('/api/sensores', (req, res) => {
    const nuevoSensor = {
        id: Date.now(),
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        valor: Number(req.body.valor)
    };

    sensores.push(nuevoSensor);
    res.status(201).json(nuevoSensor);
});

// Eliminar sensor
app.delete('/api/sensores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    sensores = sensores.filter(sensor => sensor.id !== id);
    res.json({ mensaje: 'Sensor eliminado correctamente', id });
});

// Filtrar por tipo
app.get('/api/sensores/tipo/:tipo', (req, res) => {
    const tipo = req.params.tipo;
    const filtrados = sensores.filter(s => s.tipo === tipo);
    res.json(filtrados);
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});
