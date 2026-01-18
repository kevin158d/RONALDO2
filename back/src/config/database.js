const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    //trustedConnection: true // HABILITA LA AUTENTICACIÓN DE WINDOWS
  },
};

let pool = null;

const getConnection = async () => {
  if (pool) return pool;
  pool = await sql.connect(dbConfig);
  return pool;
};

module.exports = { getConnection, sql };