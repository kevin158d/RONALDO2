import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Dashboard } from './Dashboard'; // <--- Importamos el nuevo componente

function App() {
  const [estaLogueado, setEstaLogueado] = useState(false);

  // Al cargar la página, revisamos si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setEstaLogueado(true);
    }
  }, []);

  const iniciarSesion = () => {
    setEstaLogueado(true);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token'); // Borramos token
    setEstaLogueado(false);           // Volvemos al Login
  };

  return (
    <div>
      {estaLogueado ? (
        // Si está logueado, mostramos el Dashboard con tus imágenes
        <Dashboard alSalir={cerrarSesion} />
      ) : (
        // Si NO está logueado, mostramos el Login
        <Login alEntrar={iniciarSesion} />
      )}
    </div>
  );
}

export default App;
