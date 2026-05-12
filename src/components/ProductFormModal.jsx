import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { determineStatus } from '../utils/dateUtils';

export const ProductFormModal = ({ isOpen, onClose, onSave, product, centers }) => {
  const [formData, setFormData] = useState({
    ubicacion: '',
    codigo: '',
    descripcion: '',
    marca_proveedor: '',
    serie: '',
    medidas: '',
    fecha_vencimiento: '',
    stock: 1,
    estado: 'EN_BODEGA',
    centro_medico_id: '',
    observacion: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        stock: product.stock !== undefined ? product.stock : 1,
        fecha_vencimiento: product.fecha_vencimiento || '',
        centro_medico_id: product.centro_medico_id || '',
        serie: product.serie || ''
      });
    } else {
      setFormData({
        ubicacion: '',
        codigo: '',
        descripcion: '',
        marca_proveedor: '',
        serie: '',
        medidas: '',
        fecha_vencimiento: '',
        stock: 1,
        estado: 'EN_BODEGA',
        centro_medico_id: '',
        observacion: ''
      });
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    
    // Auto-update status when relevant fields change
    if (name === 'stock' || name === 'fecha_vencimiento' || name === 'centro_medico_id') {
      const computedStatus = determineStatus(newFormData);
      newFormData.estado = computedStatus;
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">
            {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
                <input required type="text" name="codigo" value={formData.codigo} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación *</label>
                <input required type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
                <input required type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Marca / Proveedor</label>
                <input type="text" name="marca_proveedor" value={formData.marca_proveedor} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de serie</label>
                <input type="text" name="serie" value={formData.serie} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medidas</label>
                <input type="text" name="medidas" value={formData.medidas} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Vencimiento</label>
                <input type="date" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock {product ? 'Actual' : 'Inicial'} *</label>
                <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} disabled={!!product} className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${product ? 'bg-slate-100 cursor-not-allowed' : ''}`} />
                {product && <p className="text-xs text-slate-500 mt-1">El stock se modifica desde el botón Modificar Stock</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Centro Médico Asignado</label>
                <select name="centro_medico_id" value={formData.centro_medico_id} onChange={handleChange} required={formData.estado === 'ASIGNADO'} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow">
                  <option value="">Ninguno (En Bodega)</option>
                  {centers.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Observación</label>
                <textarea name="observacion" value={formData.observacion} onChange={handleChange} rows="3" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"></textarea>
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
            Cancelar
          </button>
          <button type="submit" form="productForm" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
};
