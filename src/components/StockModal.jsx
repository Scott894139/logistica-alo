import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { calculateNewStock } from '../utils/stockUtils';

export const StockModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    tipo_movimiento: 'INGRESO',
    cantidad: 1,
    observacion: ''
  });
  
  const [newStock, setNewStock] = useState(0);

  useEffect(() => {
    if (product) {
      setNewStock(calculateNewStock(product.stock, formData.tipo_movimiento, formData.cantidad));
    }
  }, [formData.tipo_movimiento, formData.cantidad, product]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newStock < 0) {
      alert('El stock no puede ser negativo.');
      return;
    }
    onSave({
      ...formData,
      stock_anterior: product.stock,
      stock_nuevo: newStock
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">Modificar Stock</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-sm font-medium text-slate-700 mb-1">{product.codigo} - {product.descripcion}</h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Stock Actual</span>
                <span className="text-2xl font-bold text-slate-800">{product.stock}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div className="text-center">
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Nuevo Stock</span>
                <span className={`text-2xl font-bold ${newStock < 0 ? 'text-red-600' : newStock > product.stock ? 'text-emerald-600' : newStock < product.stock ? 'text-orange-600' : 'text-slate-800'}`}>
                  {newStock}
                </span>
              </div>
            </div>
            {newStock < 0 && (
              <p className="text-red-500 text-xs mt-2 font-medium">El stock resultante no puede ser negativo.</p>
            )}
          </div>

          <form id="stockForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Movimiento</label>
              <select name="tipo_movimiento" value={formData.tipo_movimiento} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow">
                <option value="INGRESO">Ingreso (Suma)</option>
                <option value="SALIDA">Salida (Resta)</option>
                <option value="AJUSTE">Ajuste (Reemplaza)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
              <input required type="number" min="0" name="cantidad" value={formData.cantidad} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observación</label>
              <textarea required name="observacion" value={formData.observacion} onChange={handleChange} rows="3" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" placeholder="Motivo del movimiento..."></textarea>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
            Cancelar
          </button>
          <button type="submit" form="stockForm" disabled={newStock < 0} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Confirmar Movimiento
          </button>
        </div>
      </div>
    </div>
  );
};
