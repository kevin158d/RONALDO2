const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // <--- Nueva librería

class AuthService {
  async login(username, password) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

      if (!rows || rows.length === 0) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      const user = rows[0];

      // COMPARACIÓN SEGURA:
      // Comparamos la contraseña escrita (texto) con la encriptada de la BD (hash)
      const passwordValida = await bcrypt.compare(password, user.password);

      if (!passwordValida) {
        return { success: false, message: 'Contraseña incorrecta' };
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'secreto',
        { expiresIn: '8h' }
      );

      return {
        success: true,
        token,
        usuario: { id: user.id, username: user.username }
      };

    } catch (error) {
      console.error('Error Auth:', error);
      return { success: false, message: 'Error de servidor' };
    }
  }

  // verifyToken se queda igual...
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
      return { valid: true, usuario: decoded };
    } catch (error) {
      return { valid: false, message: 'Token inválido' };
    }
  }
}

module.exports = new AuthService();