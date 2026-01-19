const authService = require('../services/authService');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const result = authService.verifyToken(token);

    if (!result.valid) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    req.usuario = result.usuario;
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Error de autenticación' });
  }
};

module.exports = authMiddleware;