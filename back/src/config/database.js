const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos la conexión (Pool)
const pool = mysql.createPool({
  host: process.env.DB_SERVER || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD, // Esto leerá 'sistemas' de tu .env
  database: process.env.DB_NAME || 'SistemaAldq',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// PRUEBA DE CONEXIÓN AL INICIAR
pool.getConnection()
  .then(connection => {
    console.log('✅ Base de datos (MySQL) conectada correctamente');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Error al conectar con la Base de Datos:', error.message);
  });

// OJO: Exportamos "pool" directamente, sin llaves {}
module.exports = pool;