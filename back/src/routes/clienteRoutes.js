const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/comercios', clienteController.getComercios);
router.post('/clientes', clienteController.crearCliente);

module.exports = router;