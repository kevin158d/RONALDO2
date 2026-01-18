import React, { useState } from 'react';
import { Search, Copy, Check, Database, FileCode, Filter, Plus, Trash2 } from 'lucide-react';

export default function SPScriptGenerator() {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedSP, setSelectedSP] = useState(null);
  const [filters, setFilters] = useState([]);
  const [generatedScript, setGeneratedScript] = useState('');

  // Lista de Stored Procedures de ejemplo
  const storedProcedures = [
    {
      id: 1,
      name: 'sp_GetUsuarios',
      description: 'Obtiene lista de usuarios con filtros opcionales',
      params: [
        { name: '@UsuarioID', type: 'INT', required: false },
        { name: '@Nombre', type: 'NVARCHAR(100)', required: false },
        { name: '@Email', type: 'NVARCHAR(150)', required: false },
        { name: '@Estado', type: 'BIT', required: false },
        { name: '@FechaDesde', type: 'DATETIME', required: false },
        { name: '@FechaHasta', type: 'DATETIME', required: false }
      ]
    },
    {
      id: 2,
      name: 'sp_GetProductos',
      description: 'Consulta productos con múltiples filtros',
      params: [
        { name: '@ProductoID', type: 'INT', required: false },
        { name: '@Categoria', type: 'NVARCHAR(50)', required: false },
        { name: '@PrecioMin', type: 'DECIMAL(10,2)', required: false },
        { name: '@PrecioMax', type: 'DECIMAL(10,2)', required: false },
        { name: '@Stock', type: 'INT', required: false }
      ]
    },
    {
      id: 3,
      name: 'sp_GetVentas',
      description: 'Reporte de ventas con filtros temporales',
      params: [
        { name: '@VentaID', type: 'INT', required: false },
        { name: '@ClienteID', type: 'INT', required: false },
        { name: '@FechaInicio', type: 'DATETIME', required: false },
        { name: '@FechaFin', type: 'DATETIME', required: false },
        { name: '@MontoMin', type: 'DECIMAL(10,2)', required: false },
        { name: '@Estado', type: 'NVARCHAR(20)', required: false }
      ]
    }
  ];

  const filteredSPs = storedProcedures.filter(sp =>
    sp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addFilter = () => {
    if (selectedSP) {
      setFilters([...filters, { param: '', value: '', operator: '=' }]);
    }
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const generateScript = () => {
    if (!selectedSP) return;

    const activeFilters = filters.filter(f => f.param && f.value);
    
    let script = `-- Script parametrizable generado
-- Stored Procedure: ${selectedSP.name}
-- Descripción: ${selectedSP.description}

DECLARE @Result TABLE (ResultData XML);

`;

    // Declarar variables
    activeFilters.forEach(filter => {
      const param = selectedSP.params.find(p => p.name === filter.param);
      if (param) {
        script += `DECLARE ${filter.param} ${param.type} = ${formatValue(filter.value, param.type)};\n`;
      }
    });

    script += `\n-- Ejecutar Stored Procedure\nEXEC ${selectedSP.name}\n`;

    activeFilters.forEach((filter, index) => {
      script += `    ${filter.param} = ${filter.param}${index < activeFilters.length - 1 ? ',' : ';'}\n`;
    });

    script += `\n-- Filtros aplicados:\n`;
    activeFilters.forEach(filter => {
      script += `-- ${filter.param} ${filter.operator} ${filter.value}\n`;
    });

    setGeneratedScript(script);
  };

  const formatValue = (value, type) => {
    if (type.includes('VARCHAR') || type.includes('CHAR') || type.includes('DATETIME')) {
      return `'${value}'`;
    }
    return value;
  };

  const selectSPForGeneration = (sp) => {
    setSelectedSP(sp);
    setFilters([]);
    setGeneratedScript('');
    setActiveTab('generate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Sistema de Scripts SQL</h1>
          </div>
          <p className="text-blue-200">Generador de Scripts Parametrizables</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-5 h-5" />
            Lista de SPs
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileCode className="w-5 h-5" />
            Generar Script
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
          {activeTab === 'list' ? (
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar stored procedures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* SP List */}
              <div className="space-y-4">
                {filteredSPs.map((sp) => (
                  <div
                    key={sp.id}
                    className="bg-slate-900 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-2">{sp.name}</h3>
                        <p className="text-slate-300">{sp.description}</p>
                      </div>
                      <button
                        onClick={() => selectSPForGeneration(sp)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                      >
                        <FileCode className="w-4 h-4" />
                        Usar
                      </button>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="text-sm font-semibold text-slate-400 mb-3">Parámetros:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sp.params.map((param, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-2 rounded"
                          >
                            <span className="text-green-400 font-mono">{param.name}</span>
                            <span className="text-slate-500">-</span>
                            <span className="text-yellow-400">{param.type}</span>
                            {param.required && (
                              <span className="text-xs text-red-400 ml-auto">Requerido</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* SP Selection */}
              <div className="mb-6">
                <label className="block text-slate-300 font-semibold mb-2">
                  Seleccionar Stored Procedure
                </label>
                <select
                  value={selectedSP?.id || ''}
                  onChange={(e) => {
                    const sp = storedProcedures.find(s => s.id === parseInt(e.target.value));
                    setSelectedSP(sp);
                    setFilters([]);
                    setGeneratedScript('');
                  }}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Seleccione un SP --</option>
                  {storedProcedures.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name} - {sp.description}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSP && (
                <>
                  {/* Filters Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-400" />
                        Filtros
                      </h3>
                      <button
                        onClick={addFilter}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar Filtro
                      </button>
                    </div>

                    <div className="space-y-3">
                      {filters.map((filter, index) => (
                        <div key={index} className="flex gap-3 items-center bg-slate-900 p-4 rounded-lg">
                          <select
                            value={filter.param}
                            onChange={(e) => updateFilter(index, 'param', e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar parámetro</option>
                            {selectedSP.params.map((param, idx) => (
                              <option key={idx} value={param.name}>
                                {param.name} ({param.type})
                              </option>
                            ))}
                          </select>

                          <select
                            value={filter.operator}
                            onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                            className="w-24 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="=">=</option>
                            <option value="!=">!=</option>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="<=">&lt;=</option>
                            <option value="LIKE">LIKE</option>
                          </select>

                          <input
                            type="text"
                            value={filter.value}
                            onChange={(e) => updateFilter(index, 'value', e.target.value)}
                            placeholder="Valor"
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />

                          <button
                            onClick={() => removeFilter(index)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={generateScript}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg mb-6"
                  >
                    Generar Script SQL
                  </button>

                  {/* Generated Script */}
                  {generatedScript && (
                    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
                        <h3 className="text-white font-bold">Script Generado</h3>
                        <button
                          onClick={() => copyToClipboard(generatedScript, 'script')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all"
                        >
                          {copiedId === 'script' ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-6 text-sm text-green-400 font-mono overflow-x-auto">
                        {generatedScript}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}