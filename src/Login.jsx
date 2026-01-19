import React, { useState } from 'react';
import { User } from 'lucide-react'; // Usamos el icono que ya tienes instalado

export function Login({ alEntrar }) {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');

  const manejarClick = () => {
    // Aquí validamos (puedes cambiar "admin" y "1234" por lo que quieras)
    if (usuario === 'admin' && pass === '1234') {
      alEntrar(); // Esto avisa a la App que deje pasar
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Icono de Usuario (Verde/Azulado como en tu foto) */}
      <div className="mb-8">
        <User className="w-24 h-24 text-teal-600" />
      </div>

      {/* Inputs (Gris con borde negro) */}
      <div className="flex flex-col gap-4 w-64">
        <input
          type="text"
          placeholder="usuario"
          className="bg-gray-300 border border-black p-2 text-center placeholder-black"
          onChange={(e) => setUsuario(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="contraseña"
          className="bg-gray-300 border border-black p-2 text-center placeholder-black"
          onChange={(e) => setPass(e.target.value)}
        />
      </div>

      {/* Botón Inicio (Rojo y redondeado) */}
      <button
        onClick={manejarClick}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-10 rounded-full border border-black transition-colors"
      >
        Inicio
      </button>
    </div>
  );
}