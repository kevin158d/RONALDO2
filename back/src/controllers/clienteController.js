const clienteRepository = require('../repositories/clienteRepository');

class ClienteController {
  async getComercios(req, res) {
    try {
      const comercios = await clienteRepository.obtenerComercios();
      res.json(comercios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener comercios', error: error.message });
    }
  }

  async crearCliente(req, res) {
    try {
      await clienteRepository.crearCliente(req.body);
      res.json({ message: 'Cliente creado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear cliente', error: error.message });
    }
  }
}

module.exports = new ClienteController();