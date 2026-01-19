const sql = require('mssql');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_cambiar';

class AuthService {
  async login(username, password) {
    try {
      // Intentar conectar con las credenciales del usuario SQL Server
      const config = {
        user: username,
        password: password,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        options: {
          encrypt: process.env.DB_ENCRYPT === 'true',
          trustServerCertificate: process.env.DB_TRUST_CERT === 'true'
        },
        connectionTimeout: 5000
      };

      const pool = await sql.connect(config);
      await pool.close();

      // Si llegó aquí, credenciales válidas
      const token = jwt.sign(
        { username: username, loginTime: new Date() },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        success: true,
        token,
        usuario: { username }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Usuario o contraseña incorrectos'
      };
    }
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { valid: true, usuario: decoded };
    } catch (error) {
      return { valid: false, message: 'Token inválido' };
    }
  }
}

module.exports = new AuthService();