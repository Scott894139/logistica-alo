import { useState } from 'react';
import { X } from 'lucide-react';

export const AssignModal = ({ isOpen, onClose, onSave, product, centers }) => {
  const [formData, setFormData] = useState({
    centro_medico_id: '',
    cantidad: 1,
    observacion: ''
  });

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.cantidad > product.stock) {
      alert('No puedes asignar más cantidad del stock disponible.');
      return;
    }
    onSave({
      ...formData,
      stock_anterior: product.stock,
      stock_nuevo: product.stock - formData.cantidad
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">Asignar a Centro Médico</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-sm font-medium text-slate-700 mb-1">{product.codigo} - {product.descripcion}</h3>
            <p className="text-sm text-slate-500">Stock disponible: <span className="font-bold text-slate-800">{product.stock}</span></p>
          </div>

          <form id="assignForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Centro Médico *</label>
              <select required name="centro_medico_id" value={formData.centro_medico_id} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow">
                <option value="">Seleccione un centro médico</option>
                {centers.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad a asignar *</label>
              <input required type="number" min="1" max={product.stock} name="cantidad" value={formData.cantidad} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observación</label>
              <textarea required name="observacion" value={formData.observacion} onChange={handleChange} rows="3" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" placeholder="Detalles de la asignación..."></textarea>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
            Cancelar
          </button>
          <button type="submit" form="assignForm" disabled={formData.cantidad > product.stock} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Confirmar Asignación
          </button>
        </div>
      </div>
    </div>
  );
};
