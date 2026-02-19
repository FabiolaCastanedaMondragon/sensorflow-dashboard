// ============================================
// FRONTEND: Dashboard Reactivo con React
// ============================================

import { useState, useEffect } from 'react'
import './App.css'

function App() {

  // ESTADOS REACTIVOS
  const [sensores, setSensores] = useState([])
  const [formulario, setFormulario] = useState({
    nombre: '',
    tipo: '',
    valor: ''
  })

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState('todos')

  // Cargar sensores al iniciar
  useEffect(() => {
    cargarSensores()
  }, [])

  const cargarSensores = async () => {
    setCargando(true)
    setError(null)

    try {
      const respuesta = await fetch('http://localhost:3001/api/sensores')

      if (!respuesta.ok) {
        throw new Error('Error en la respuesta')
      }

      const datos = await respuesta.json()
      setSensores(datos)

    } catch (err) {
      console.error(err)
      setError("No se pudo conectar con el servidor")
    } finally {
      setCargando(false)
    }
  }

  // Manejar formulario
  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    })
  }

  // Agregar sensor
  const agregarSensor = async (e) => {
    e.preventDefault()

    if (!formulario.nombre || !formulario.tipo || !formulario.valor) {
      alert("Completa todos los campos")
      return
    }

    try {
      const respuesta = await fetch('http://localhost:3001/api/sensores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      })

      if (!respuesta.ok) throw new Error("Error al crear")

      setFormulario({ nombre: '', tipo: '', valor: '' })
      cargarSensores()

    } catch (err) {
      alert("Error al agregar sensor")
    }
  }

  // Eliminar sensor
  const eliminarSensor = async (id) => {
    if (!confirm("¿Eliminar este sensor?")) return

    try {
      await fetch(`http://localhost:3001/api/sensores/${id}`, {
        method: 'DELETE'
      })

      cargarSensores()

    } catch (err) {
      alert("Error al eliminar")
    }
  }

  // Filtrado
  const sensoresFiltrados =
    filtroTipo === 'todos'
      ? sensores
      : sensores.filter(s => s.tipo === filtroTipo)

  // VISTA
  return (
    <div className="contenedor">

      <header>
        <h1>📡 SensorFlow Dashboard</h1>
        <p className="subtitulo">React + Node.js</p>
      </header>

      {/* FORMULARIO */}
      <form onSubmit={agregarSensor} className="formulario">

        <input
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={manejarCambio}
        />

        <select
          name="tipo"
          value={formulario.tipo}
          onChange={manejarCambio}
        >
          <option value="">Tipo</option>
          <option value="Temperatura">Temperatura</option>
          <option value="Humedad">Humedad</option>
          <option value="Luz">Luz</option>
        </select>

        <input
          name="valor"
          type="number"
          placeholder="Valor"
          value={formulario.valor}
          onChange={manejarCambio}
        />

        <button type="submit">
          ➕ Agregar
        </button>
      </form>

      {/* FILTRO */}
      <div className="filtros">
        <label>Filtrar: </label>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="Temperatura">Temperatura</option>
          <option value="Humedad">Humedad</option>
          <option value="Luz">Luz</option>
        </select>
      </div>

      {/* MENSAJES */}
      {error && <div className="error">{error}</div>}
      {cargando && <p className="cargando">Cargando...</p>}

      {/* LISTA */}
      <div className="grid-sensores">
        {sensoresFiltrados.map(sensor => (
          <div key={sensor.id} className="tarjeta-sensor">
            <h3>{sensor.nombre}</h3>
            <p>{sensor.tipo}</p>
            <p className="valor">{sensor.valor}</p>

            <button
              className="btn-eliminar"
              onClick={() => eliminarSensor(sensor.id)}
            >
              🗑️ Eliminar
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default App