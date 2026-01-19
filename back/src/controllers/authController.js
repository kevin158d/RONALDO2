const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ 
          message: 'Usuario y contraseña son requeridos' 
        });
      }

      const result = await authService.login(username, password);

      if (!result.success) {
        return res.status(401).json({ message: result.message });
      }

      res.json({
        success: true,
        message: 'Login exitoso',
        token: result.token,
        usuario: result.usuario
      });

    } catch (error) {
      res.status(500).json({ 
        message: 'Error en el servidor', 
        error: error.message 
      });
    }
  }

  async verify(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
      }

      const result = authService.verifyToken(token);

      if (!result.valid) {
        return res.status(401).json({ message: result.message });
      }

      res.json({ valid: true, usuario: result.usuario });

    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  }

  async logout(req, res) {
    res.json({ message: 'Sesión cerrada exitosamente' });
  }
}

module.exports = new AuthController();