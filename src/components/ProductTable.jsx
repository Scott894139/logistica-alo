import { Edit2, PackageMinus, RefreshCcw, Send, Trash2, History, AlertTriangle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/dateUtils';

export const ProductTable = ({ 
  products, 
  centers, 
  onEdit, 
  onDelete, 
  onModifyStock, 
  onAssign, 
  onReturn, 
  onHistory 
}) => {

  const getCenterName = (id) => {
    if (!id) return '-';
    const center = centers.find(c => c.id === id);
    return center ? center.nombre : '-';
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center text-slate-500">
        No se encontraron productos con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ubica</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Marca Proveedor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Series</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Medidas (mm.)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha Vencimiento</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Centro Médico</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {product.ubicacion}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                  {product.codigo}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-slate-900 truncate max-w-[150px]" title={product.descripcion}>
                    {product.descripcion}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {product.marca_proveedor || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {product.serie || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {product.medidas || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {formatDate(product.fecha_vencimiento)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  {getCenterName(product.centro_medico_id)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={product.estado} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${product.stock <= 5 && product.stock > 0 ? 'text-orange-600' : product.stock === 0 ? 'text-red-600' : 'text-slate-900'}`}>
                      {product.stock}
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="flex items-center text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-xs border border-orange-200" title="Stock bajo (5 o menos)">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Bajo
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-900" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onModifyStock(product)} className="text-emerald-600 hover:text-emerald-900" title="Modificar Stock">
                      <PackageMinus className="w-4 h-4" />
                    </button>
                    <button onClick={() => onAssign(product)} className="text-indigo-600 hover:text-indigo-900" title="Asignar">
                      <Send className="w-4 h-4" />
                    </button>
                    <button onClick={() => onReturn(product)} className="text-orange-600 hover:text-orange-900" title="Devolver a bodega">
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                    <button onClick={() => onHistory(product)} className="text-slate-600 hover:text-slate-900" title="Ver historial">
                      <History className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(product)} className="text-red-600 hover:text-red-900" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
