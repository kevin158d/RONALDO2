import React, { useState } from 'react';
import { Login } from './Login'; // Importamos tu ventana de Login
import { Search, Copy, Check, Database, Filter, Plus, Trash2, FileCode } from 'lucide-react';

const App = () => {
  // --- 1. ESTADO DEL LOGIN ---
  const [haIngresado, setHaIngresado] = useState(false);

  // --- 2. DATOS Y LÓGICA DEL GENERADOR (Tu código completo) ---
  
  // Datos de ejemplo (Simulación de tu base de datos completa)
  const storedProcedures = [
    { 
      name: 'sp_GetUsuarios', 
      desc: 'Obtiene lista de usuarios activos',
      params: ['FechaRegistro', 'Estado', 'Rol', 'Sucursal', 'NombreUsuario'] 
    },
    { 
      name: 'sp_VentasReporte', 
      desc: 'Reporte detallado de ventas mensuales',
      params: ['FechaInicio', 'FechaFin', 'VendedorID', 'Zona', 'ProductoID'] 
    },
    { 
      name: 'sp_InventarioActual', 
      desc: 'Consulta de stock y movimientos',
      params: ['CategoriaID', 'Almacen', 'BajoStock', 'ProveedorID'] 
    },
    {
      name: 'sp_AuditLog',
      desc: 'Registro de auditoría del sistema',
      params: ['UserID', 'ActionType', 'DateRangeStart', 'DateRangeEnd', 'Severity']
    }
  ];

  const [selectedSp, setSelectedSp] = useState('');
  const [filters, setFilters] = useState([{ id: 1, param: '', operator: '=', value: '' }]);
  const [script, setScript] = useState('');
  const [copied, setCopied] = useState(false);

  // Agregar una nueva fila de filtro
  const addFilter = () => {
    const newId = filters.length > 0 ? Math.max(...filters.map(f => f.id)) + 1 : 1;
    setFilters([...filters, { id: newId, param: '', operator: '=', value: '' }]);
  };

  // Eliminar un filtro
  const removeFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  // Actualizar valores de los filtros
  const updateFilter = (id, field, val) => {
    setFilters(filters.map(f => (f.id === id ? { ...f, [field]: val } : f)));
  };

  // --- LOGICA DE GENERACIÓN DE SCRIPT (La versión avanzada) ---
  const generateScript = () => {
    if (!selectedSp) return;

    // 1. Empezamos con el comando básico
    let sql = `EXEC ${selectedSp} \n`;

    // 2. Filtramos solo los que tienen parámetro y valor escritos
    const validFilters = filters.filter(f => f.param && f.value);

    // 3. Mapeamos cada filtro al formato @Param = 'Valor'
    const paramsList = validFilters.map(f => {
      // Detectamos si el valor parece número para no ponerle comillas (opcional)
      const isNumber = !isNaN(f.value) && f.value.trim() !== '';
      const finalValue = isNumber ? f.value : `'${f.value}'`;
      
      // Lógica especial para operadores
      if (f.operator === 'LIKE') {
        return `\t@${f.param} LIKE '%${f.value}%'`;
      }
      
      return `\t@${f.param} ${f.operator} ${finalValue}`;
    });

    // 4. Unimos todos los parámetros con comas
    if (paramsList.length > 0) {
      sql += paramsList.join(',\n');
    }

    setScript(sql);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Buscar la info del SP seleccionado para llenar los selectores
  const currentSpData = storedProcedures.find(sp => sp.name === selectedSp);

  // --- 3. RENDERIZADO CONDICIONAL ---
  
  // Si NO ha ingresado, mostramos SOLAMENTE el Login
  if (!haIngresado) {
    return <Login alEntrar={() => setHaIngresado(true)} />;
  }

  // Si YA ingresó, mostramos TU APLICACIÓN COMPLETA
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header con degradado */}
        <div className="flex items-center space-x-4 mb-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Database size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              Generador SQL Pro v2.0
            </h1>
            <p className="text-slate-400 text-sm">Sistema de generación automatizada de scripts</p>
          </div>
        </div>

        {/* Panel Principal */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700/50 backdrop-blur-sm">
          
          {/* Selector de SP */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Seleccionar Procedimiento Almacenado</label>
            <div className="relative group">
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 pl-12 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all cursor-pointer hover:border-slate-600"
                onChange={(e) => {
                  setSelectedSp(e.target.value);
                  setFilters([{ id: 1, param: '', operator: '=', value: '' }]); 
                  setScript('');
                }}
                value={selectedSp}
              >
                <option value="">-- Selecciona un procedimiento --</option>
                {storedProcedures.map(sp => (
                  <option key={sp.name} value={sp.name}>
                    {sp.name} — {sp.desc}
                  </option>
                ))}
              </select>
              <FileCode className="absolute left-4 top-4 text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
            </div>
          </div>

          {/* Área de Filtros Dinámicos */}
          <div className="space-y-4 mb-8 bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
            <div className="flex justify-between items-end mb-4 border-b border-slate-700 pb-2">
              <label className="flex items-center text-sm font-medium text-slate-300">
                <Filter size={16} className="mr-2 text-blue-400" />
                Configuración de Parámetros
              </label>
              <button 
                onClick={addFilter}
                className="text-xs flex items-center bg-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-all duration-200"
              >
                <Plus size={14} className="mr-1" /> Nuevo Parámetro
              </button>
            </div>

            {filters.map((filter) => (
              <div key={filter.id} className="flex gap-3 items-center group animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Selector de Parámetro */}
                <select 
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors"
                  value={filter.param}
                  onChange={(e) => updateFilter(filter.id, 'param', e.target.value)}
                  disabled={!selectedSp}
                >
                  <option value="">Parametro...</option>
                  {currentSpData?.params.map(p => <option key={p} value={p}>@{p}</option>)}
                </select>

                {/* Operador */}
                <select 
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-center font-mono text-blue-300"
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                >
                  <option>=</option>
                  <option>LIKE</option>
                  <option>{'>'}</option>
                  <option>{'<'}</option>
                  <option>{'>='}</option>
                  <option>{'<='}</option>
                  <option>IN</option>
                </select>

                {/* Valor */}
                <input 
                  type="text" 
                  placeholder="Valor a buscar..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors placeholder-slate-600"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                />

                {/* Botón Eliminar */}
                <button 
                  onClick={() => removeFilter(filter.id)}
                  className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                  title="Eliminar fila"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Botón Generar Grande */}
          <button 
            onClick={generateScript}
            disabled={!selectedSp}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
          >
            <Database size={20} />
            <span>Generar Script Unificado</span>
          </button>
        </div>

        {/* Resultado Script */}
        {script && (
          <div className="bg-slate-950 rounded-2xl p-1 border border-slate-800 shadow-2xl relative group overflow-hidden">
            {/* Barra superior del editor */}
            <div className="bg-slate-900/80 px-4 py-2 flex justify-between items-center border-b border-slate-800">
              <span className="text-xs font-mono text-slate-500">SQL Server Query</span>
              <button 
                onClick={copyToClipboard}
                className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-md transition-all ${
                  copied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? '¡Copiado!' : 'Copiar Script'}</span>
              </button>
            </div>
            
            {/* Contenido del Código */}
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400 leading-relaxed">
                <code>{script}</code>
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;