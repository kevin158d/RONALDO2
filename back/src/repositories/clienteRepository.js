const { getConnection, sql } = require('../config/database');

class ClienteRepository {
  async obtenerComercios() {
    const pool = await getConnection();
    const result = await pool.request()
      .execute('sp_ObtenerComercios');
    return result.recordset;
  }

  async crearCliente(datos) {
    const pool = await getConnection();
    await pool.request()
      .input('nombre', sql.VarChar, datos.nombre)
      .input('apellido', sql.VarChar, datos.apellido)
      .input('email', sql.VarChar, datos.email)
      .input('telefono', sql.VarChar, datos.telefono)
      .input('comercioId', sql.Int, datos.comercioId)
      .execute('sp_CrearCliente');
    return { success: true };
  }
}

module.exports = new ClienteRepository();