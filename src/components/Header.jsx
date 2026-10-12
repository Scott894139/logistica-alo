import { PackagePlus, Filter } from 'lucide-react';

export const Header = ({ onAddProduct, onToggleFilters, showFilters }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PackagePlus className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Sistema Logístico Médico</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                showFilters 
                  ? 'bg-slate-100 text-slate-700' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
            <button
              onClick={onAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-md shadow-sm transition-colors"
            >
              <PackagePlus className="w-4 h-4" />
              Agregar producto
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
