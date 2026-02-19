const express = require('express');        // Framework web para Node.js
const cors = require('cors');              // Permite conexión con el frontend
const bodyParser = require('body-parser'); // Procesa JSON

const app = express();

// ✅ Puerto dinámico: Render lo asigna automáticamente, si es local usa 3001
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// --- BASE DE DATOS SIMULADA ---
let sensores = [
    { id: 1, nombre: 'Sensor Sala', tipo: 'Temperatura', valor: 24 },
    { id: 2, nombre: 'Sensor Cocina', tipo: 'Humedad', valor: 60 },
    { id: 3, nombre: 'Sensor Jardín', tipo: 'Luz', valor: 85 }
];

// Rutas del backend
app.get('/api/sensores', (req, res) => {
    res.json(sensores);
});

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

app.delete('/api/sensores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    sensores = sensores.filter(sensor => sensor.id !== id);
    res.json({ mensaje: 'Sensor eliminado correctamente', id });
});

app.get('/api/sensores/tipo/:tipo', (req, res) => {
    const tipo = req.params.tipo;
    const filtrados = sensores.filter(s => s.tipo === tipo);
    res.json(filtrados);
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});
