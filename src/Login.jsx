import React, { useState } from 'react';
import { User, Eye, EyeOff, Loader2 } from 'lucide-react'; // Importamos los iconos nuevos

export function Login({ alEntrar }) {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false); // Estado para alternar el ojito
  const [cargando, setCargando] = useState(false);       // Estado para la carga

  const manejarClick = async (e) => {
    e.preventDefault(); // Evita recargas raras

    // 1. Validación básica visual
    if (!usuario || !pass) {
      alert("⚠️ Por favor escribe usuario y contraseña");
      return;
    }

    // 2. Activamos modo "Cargando"
    setCargando(true);

    try {
      // Petición al backend
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password: pass })
      });

      const data = await response.json();

      if (data.success) {
        // Guardamos token y entramos
        localStorage.setItem('token', data.token);
        // Pequeña pausa artificial (opcional) para que se vea el efecto "Cargando"
        setTimeout(() => {
             alEntrar();
        }, 500); 
      } else {
        alert("❌ " + (data.message || "Credenciales incorrectas"));
      }

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al conectar con el servidor");
    } finally {
      // 3. Desactivamos carga si hubo error (si hubo éxito, el componente se desmonta)
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Tarjeta del Login */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80 flex flex-col items-center border border-gray-200">
        
        {/* Icono Principal */}
        <div className="bg-teal-100 p-4 rounded-full mb-6">
          <User className="w-12 h-12 text-teal-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bienvenido</h2>

        <form className="w-full flex flex-col gap-4">
          
          {/* Input Usuario */}
          <div className="relative">
            <input
              type="text"
              placeholder="Usuario"
              disabled={cargando}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Input Contraseña con Ojito */}
          <div className="relative">
            <input
              type={mostrarPass ? "text" : "password"} // Aquí ocurre la magia del cambio
              placeholder="Contraseña"
              disabled={cargando}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            
            {/* Botón del Ojo */}
            <button
              type="button"
              onClick={() => setMostrarPass(!mostrarPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
            >
              {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Botón de Ingreso */}
          <button
            onClick={manejarClick}
            disabled={cargando}
            className={`mt-4 w-full py-2 rounded-lg font-semibold text-white transition-all flex justify-center items-center gap-2 shadow-md
              ${cargando 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg active:scale-95'}`}
          >
            {cargando ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Entrando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

        </form>
      </div>
      
      <p className="mt-8 text-gray-400 text-sm">Sistema Ronaldo v1.0</p>
    </div>
  );
}