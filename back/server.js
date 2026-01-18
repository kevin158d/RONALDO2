const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const authMiddleware = require('./src/middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);

// Rutas protegidas (con autenticación)
app.use('/api', authMiddleware, clienteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔐 Sistema de autenticación activo`);
});