import { Search, X } from 'lucide-react';

export const FilterPanel = ({ filters, setFilters, centers, onClear }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={filters.ubicacion}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Buscar (Código, Desc, Serie, Marca)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              className="pl-9 w-full rounded-md border border-slate-300 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Término de búsqueda..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Estado</label>
          <select
            name="estado"
            value={filters.estado}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="">Todos</option>
            <option value="EN_BODEGA">En Bodega</option>
            <option value="ASIGNADO">Asignado</option>
            <option value="SIN_STOCK">Sin Stock</option>
            <option value="POR_VENCER">Por Vencer</option>
            <option value="VENCIDO">Vencido</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Centro Médico</label>
          <select
            name="centro_medico_id"
            value={filters.centro_medico_id}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="">Todos</option>
            {centers.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Vencimiento Desde</label>
          <input
            type="date"
            name="fechaDesde"
            value={filters.fechaDesde}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Vencimiento Hasta</label>
          <input
            type="date"
            name="fechaHasta"
            value={filters.fechaHasta}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="vencidos"
              checked={filters.vencidos}
              onChange={handleChange}
              className="rounded text-primary focus:ring-primary"
            />
            Solo vencidos
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="porVencer"
              checked={filters.porVencer}
              onChange={handleChange}
              className="rounded text-primary focus:ring-primary"
            />
            Solo por vencer
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="sinStock"
              checked={filters.sinStock}
              onChange={handleChange}
              className="rounded text-primary focus:ring-primary"
            />
            Solo sin stock
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="bajoStock"
              checked={filters.bajoStock}
              onChange={handleChange}
              className="rounded text-primary focus:ring-primary"
            />
            Solo stock bajo (≤ 5)
          </label>
        </div>

        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};
