import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { formatDate } from '../utils/dateUtils';

export const HistoryModal = ({ isOpen, onClose, product, centers }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && product) {
      loadHistory();
    }
  }, [isOpen, product]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('movimientos_stock')
        .select('*')
        .eq('producto_id', product.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  const getCenterName = (id) => {
    if (!id) return '-';
    const center = centers.find(c => c.id === id);
    return center ? center.nombre : '-';
  };

  const getMovementColor = (type) => {
    switch (type) {
      case 'INGRESO': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'DEVOLUCION': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'SALIDA': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ASIGNACION': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'AJUSTE': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Historial de Movimientos</h2>
            <p className="text-sm text-slate-500 mt-1">{product.codigo} - {product.descripcion}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-0 overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Cargando historial...</div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No hay movimientos registrados para este producto.</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cambio de Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Centro Médico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Observación</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {history.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(mov.created_at).toLocaleString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMovementColor(mov.tipo_movimiento)}`}>
                        {mov.tipo_movimiento}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">{mov.stock_anterior}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                        <span className="font-medium text-slate-900">{mov.stock_nuevo}</span>
                        <span className="text-xs text-slate-500 ml-1">({mov.cantidad})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {getCenterName(mov.centro_medico_id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={mov.observacion}>
                      {mov.observacion || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
