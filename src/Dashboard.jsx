import React, { useState } from 'react';
import { Search, List, Settings, Filter, LogOut, X, Copy, Check, Save } from 'lucide-react';

// TUS IMÁGENES
import headerBg from './assets/header-bg.jpg'; 
import cardBg from './assets/card-bg.jpg'; 
import logoImg from './assets/logo.png'; 

export function Dashboard({ alSalir }) {
  const [scriptSeleccionado, setScriptSeleccionado] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [busqueda, setBusqueda] = useState(''); 
  const [vistaActual, setVistaActual] = useState('lista');

  // Datos fijos (simulados)
  const scripts = [
    {
      titulo: "GetUsuarios",
      desc: "Obtiene lista de usuarios con filtros opcionales",
      params: ["@nombre", "@estado", "@fechahasta"],
      sql: `SELECT * FROM users \nWHERE (@nombre IS NULL OR username LIKE '%' + @nombre + '%')\nAND (@estado IS NULL OR status = @estado);`
    },
    {
      titulo: "GetProductos",
      desc: "Consulta productos con multiples filtros",
      params: ["@nombre", "@categ", "@stock"],
      sql: `SELECT p.id, p.nombre, c.categoria \nFROM productos p\nJOIN categorias c ON p.cat_id = c.id\nWHERE p.stock > @stock;`
    },
    {
      titulo: "GetVentas",
      desc: "Reporte de ventas con filtros temporales",
      params: ["@cliente", "@desde", "@hasta"],
      sql: `SELECT v.folio, v.total, c.nombre \nFROM ventas v\nINNER JOIN clientes c ON v.cliente_id = c.id\nWHERE v.fecha BETWEEN @desde AND @hasta;`
    }
  ];

  const scriptsFiltrados = scripts.filter(script => 
    script.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    script.desc.toLowerCase().includes(busqueda.toLowerCase())
  );

  const copiarCodigo = () => {
    if (scriptSeleccionado) {
      navigator.clipboard.writeText(scriptSeleccionado.sql);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  // --- CLASES PARA LOS BOTONES ---
  const baseButtonClass = "px-6 py-2 rounded-full shadow-md flex items-center gap-2 transition-all transform duration-300";
  const activeButtonClass = "bg-slate-800 text-white border-4 border-white scale-110 shadow-xl font-bold z-10";
  const inactiveButtonClass = "bg-white/90 text-gray-800 border border-orange-200 hover:bg-orange-100 hover:scale-105 font-semibold";

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* --- ENCABEZADO ESTABLE --- */}
      <header 
        className="w-full h-28 shadow-lg flex items-center justify-between px-8 bg-cover bg-center relative z-20"
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        {/* LADO IZQUIERDO: LOGO (Ancho fijo para evitar saltos) */}
        <div className="flex items-center gap-4 bg-white/90 p-3 rounded-xl backdrop-blur-sm shadow-md min-w-[280px]">
          <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain filter drop-shadow-sm" />
          <div className="flex flex-col">
            <h1 className="font-extrabold text-2xl text-gray-800 leading-none tracking-tight">SISTEMA DE</h1>
            <h1 className="font-extrabold text-2xl text-orange-600 leading-none tracking-tight">SCRIPTS SQL</h1>
          </div>
        </div>

        {/* CENTRO: BOTONES DE NAVEGACIÓN */}
        <div className="flex gap-4 items-center absolute left-1/2 transform -translate-x-1/2">
            <button 
                onClick={() => setVistaActual('lista')}
                className={`${baseButtonClass} ${vistaActual === 'lista' ? activeButtonClass : inactiveButtonClass}`}
            >
                <List size={vistaActual === 'lista' ? 24 : 20}/> Lista
            </button>
            
            <button 
                onClick={() => setVistaActual('generar')}
                className={`${baseButtonClass} ${vistaActual === 'generar' ? activeButtonClass : inactiveButtonClass}`}
            >
                <Settings size={vistaActual === 'generar' ? 24 : 20}/> Generar
            </button>
            
            <button className={`opacity-60 cursor-not-allowed ${baseButtonClass} ${inactiveButtonClass}`}>
                <Filter size={20}/> Filtro
            </button>
        </div>

        {/* LADO DERECHO: BUSCADOR Y LOGOUT */}
        <div className="flex gap-4 items-center justify-end min-w-[280px]">
            {/* MODIFICACIÓN AQUÍ:
                Este input se mantiene visualmente igual, pero le quité "value" y "onChange".
                Ahora escribir aquí NO afecta el listado de abajo.
            */}
            <div className={`relative group transition-all duration-300 ${vistaActual === 'lista' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar script..." 
                    // HE QUITADO value={busqueda} y onChange
                    className="pl-10 pr-4 py-2 rounded-full bg-white/90 border-none shadow-inner focus:ring-2 focus:ring-orange-400 outline-none w-64 transition-all"
                />
            </div>

            <button onClick={alSalir} className="text-white hover:text-red-200 bg-red-600/80 hover:bg-red-600 p-3 rounded-full transition-colors shadow-lg hover:scale-110 active:scale-95" title="Cerrar Sesión">
                <LogOut size={22} />
            </button>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="container mx-auto p-8 relative z-10">
        
        {vistaActual === 'lista' ? (
            <>
                {/* VISTA LISTA */}
                <div className="bg-gray-100 rounded-full p-4 mb-8 flex items-center shadow-inner border border-gray-200 animate-in fade-in duration-300">
                    <Search className="text-gray-400 ml-4 mr-2" size={24} />
                    {/* ESTE ES EL INPUT QUE SÍ FILTRA */}
                    <input 
                        type="text" 
                        placeholder="Buscar en la lista..." 
                        className="bg-transparent text-xl w-full outline-none text-gray-700 placeholder-gray-400"
                        value={busqueda} // Este sí tiene el value
                        onChange={(e) => setBusqueda(e.target.value)} // Este sí tiene el onChange
                    />
                </div>

                <div className="flex flex-col gap-6">
                {scriptsFiltrados.map((script, index) => (
                    <div key={index} className="rounded-xl shadow-xl overflow-hidden relative p-6 bg-cover bg-center border border-orange-300 transition-all hover:shadow-2xl hover:-translate-y-1" style={{ backgroundImage: `url(${cardBg})` }}>
                        <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-1 drop-shadow-sm">{script.titulo}</h2>
                                <div className="h-1 w-full bg-orange-500/50 mb-4 rounded-full"></div>
                                <p className="text-gray-800 font-semibold mb-4 text-right italic">{script.desc}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {script.params.map((param, i) => (
                                        <div key={i} className="bg-slate-800/90 rounded-md p-2 border-l-4 border-teal-400 shadow-md backdrop-blur-sm">
                                            <span className="text-teal-300 font-mono text-sm">{param}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-end h-full mt-20 ml-8">
                                <button onClick={() => setScriptSeleccionado(script)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg border-2 border-teal-500 transition-all active:scale-95 hover:shadow-teal-500/30 hover:scale-105">
                                    Usar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </>
        ) : (
            /* VISTA GENERAR (FORMULARIO) */
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg shadow-sm"><Settings className="text-orange-600" size={32}/></div>
                    Crear Nuevo Script
                </h2>
                
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Título del Script</label>
                        <input type="text" placeholder="Ej: GetClientesVip" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all font-medium" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                        <input type="text" placeholder="¿Qué hace este script?" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Parámetros (separados por coma)</label>
                        <input type="text" placeholder="@id, @fecha, @estado" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all font-mono text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Código SQL</label>
                        <textarea rows="8" placeholder="SELECT * FROM..." className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all font-mono text-sm bg-slate-800 text-teal-300"></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                        <button type="button" onClick={() => setVistaActual('lista')} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-bold hover:bg-gray-100 rounded-xl transition-all">
                            Cancelar
                        </button>
                        <button type="button" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
                            <Save size={22}/> Guardar Script
                        </button>
                    </div>
                </form>
            </div>
        )}

      </main>

      {/* --- MODAL (POP-UP) --- */}
      {scriptSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-teal-500">
                <div className="bg-teal-600 p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-2xl flex items-center gap-2 drop-shadow-sm"><List size={24}/> {scriptSeleccionado.titulo}</h3>
                    <button onClick={() => setScriptSeleccionado(null)} className="text-teal-100 hover:text-white hover:bg-teal-700/50 p-2 rounded-full transition-all hover:rotate-90"><X size={24} /></button>
                </div>
                <div className="p-8 bg-gray-50">
                    <p className="text-gray-700 mb-3 font-bold flex items-center gap-2"><Copy size={18}/> Código SQL Generado:</p>
                    <div className="bg-slate-900 rounded-xl p-6 relative group shadow-inner border border-slate-700">
                        <pre className="text-teal-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap"><code>{scriptSeleccionado.sql}</code></pre>
                        <button onClick={copiarCodigo} className={`absolute top-3 right-3 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-md ${copiado ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                            {copiado ? <Check size={20} className="text-white"/> : <Copy size={20}/>}
                        </button>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button onClick={() => setScriptSeleccionado(null)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-bold hover:bg-gray-200 rounded-xl transition-all">Cerrar</button>
                        <button onClick={copiarCodigo} className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${copiado ? 'bg-green-600' : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-teal-500/30'}`}>
                           {copiado ? <>¡Copiado! <Check size={20}/></> : <>Copiar al Portapapeles <Copy size={20}/></>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}