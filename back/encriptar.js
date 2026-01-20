const bcrypt = require('bcryptjs');

const password = '1234'; // <--- Pon aquí la contraseña que quieras encriptar

bcrypt.hash(password, 10, (err, hash) => {
  if (err) console.error(err);
  console.log('------------------------------------------------');
  console.log(`Tu contraseña "${password}" encriptada es:`);
  console.log(hash); // <--- COPIA ESTO Y PONLO EN TU SQL
  console.log('------------------------------------------------');
});