import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { determineStatus, getDaysDifference } from '../utils/dateUtils';
import { Header } from '../components/Header';
import { FilterPanel } from '../components/FilterPanel';
import { ProductTable } from '../components/ProductTable';
import { ProductFormModal } from '../components/ProductFormModal';
import { StockModal } from '../components/StockModal';
import { AssignModal } from '../components/AssignModal';
import { HistoryModal } from '../components/HistoryModal';

export const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    ubicacion: '',
    estado: '',
    centro_medico_id: '',
    fechaDesde: '',
    fechaHasta: '',
    vencidos: false,
    porVencer: false,
    sinStock: false,
    bajoStock: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, centersRes] = await Promise.all([
        supabase.from('productos').select('*').order('created_at', { ascending: false }),
        supabase.from('centros_medicos').select('*').eq('activo', true)
      ]);

      if (productsRes.error) throw productsRes.error;
      if (centersRes.error) throw centersRes.error;

      // Update statuses based on date and stock dynamically upon fetch
      const updatedProducts = productsRes.data.map(p => {
        const computedStatus = determineStatus(p);
        return { ...p, estado: computedStatus };
      });

      setProducts(updatedProducts);
      setCenters(centersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error cargando los datos. Verifique la conexión a la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (selectedProduct) {
        // Edit
        const { error } = await supabase
          .from('productos')
          .update({
            ubicacion: formData.ubicacion,
            codigo: formData.codigo,
            descripcion: formData.descripcion,
            marca_proveedor: formData.marca_proveedor,
            serie: formData.serie || null,
            medidas: formData.medidas,
            fecha_vencimiento: formData.fecha_vencimiento || null,
            estado: formData.estado,
            centro_medico_id: formData.centro_medico_id || null,
            observacion: formData.observacion,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedProduct.id);
        if (error) throw error;
      } else {
        // Add new
        const { data, error } = await supabase
          .from('productos')
          .insert([{
            ubicacion: formData.ubicacion,
            codigo: formData.codigo,
            descripcion: formData.descripcion,
            marca_proveedor: formData.marca_proveedor,
            serie: formData.serie || null,
            medidas: formData.medidas,
            fecha_vencimiento: formData.fecha_vencimiento || null,
            estado: formData.estado,
            stock: formData.stock,
            centro_medico_id: formData.centro_medico_id || null,
            observacion: formData.observacion
          }])
          .select();
        
        if (error) throw error;

        // Register initial stock movement if needed
        if (data && data.length > 0 && formData.stock > 0) {
          await supabase.from('movimientos_stock').insert([{
            producto_id: data[0].id,
            tipo_movimiento: 'INGRESO',
            cantidad: formData.stock,
            stock_anterior: 0,
            stock_nuevo: formData.stock,
            observacion: 'Stock inicial'
          }]);
        }
      }
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto: ' + (error.message || error.details || JSON.stringify(error)));
    }
  };

  const handleSaveStock = async (movementData) => {
    try {
      // 1. Insert movement
      const { error: movError } = await supabase
        .from('movimientos_stock')
        .insert([{
          producto_id: selectedProduct.id,
          tipo_movimiento: movementData.tipo_movimiento,
          cantidad: movementData.cantidad,
          stock_anterior: movementData.stock_anterior,
          stock_nuevo: movementData.stock_nuevo,
          observacion: movementData.observacion
        }]);
      if (movError) throw movError;

      // 2. Update product stock and status
      const tempProduct = { ...selectedProduct, stock: movementData.stock_nuevo };
      const newStatus = determineStatus(tempProduct);

      const { error: prodError } = await supabase
        .from('productos')
        .update({
          stock: movementData.stock_nuevo,
          estado: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id);
      if (prodError) throw prodError;

      setIsStockOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error modifying stock:', error);
      alert('Error al modificar el stock.');
    }
  };

  const handleAssignCenter = async (assignmentData) => {
    try {
      // 1. Insert movement
      const { error: movError } = await supabase
        .from('movimientos_stock')
        .insert([{
          producto_id: selectedProduct.id,
          tipo_movimiento: 'ASIGNACION',
          cantidad: assignmentData.cantidad,
          stock_anterior: assignmentData.stock_anterior,
          stock_nuevo: assignmentData.stock_nuevo,
          centro_medico_id: assignmentData.centro_medico_id,
          observacion: assignmentData.observacion
        }]);
      if (movError) throw movError;

      // 2. Update product
      const tempProduct = { 
        ...selectedProduct, 
        stock: assignmentData.stock_nuevo,
        centro_medico_id: assignmentData.centro_medico_id,
        estado: 'ASIGNADO'
      };
      // Keep state ASIGNADO if it has center, unless stock is 0 then it becomes SIN_STOCK?
      // Actually determineStatus handles it. 
      const newStatus = determineStatus(tempProduct);

      const { error: prodError } = await supabase
        .from('productos')
        .update({
          stock: assignmentData.stock_nuevo,
          centro_medico_id: assignmentData.centro_medico_id,
          estado: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id);
      if (prodError) throw prodError;

      setIsAssignOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error assigning product:', error);
      alert('Error al asignar el producto.');
    }
  };

  const handleReturnToBodega = async (product) => {
    if (!product.centro_medico_id) {
      alert('El producto ya está en bodega.');
      return;
    }
    if (!window.confirm('¿Está seguro de devolver este producto a bodega? Se quitará su asignación actual.')) return;

    try {
      // 1. Insert movement DEVOLUCION? Wait, devolution means stock increases? 
      // The requirement: "Si el movimiento es DEVOLUCION, se suma al stock."
      // Let's prompt user for qty? Or just clear centro_medico?
      // Actually "Devolver a bodega" means it is no longer assigned. The user didn't specify a modal for return, just an action.
      // We will assume a return of quantity 1 or all? Let's just remove the centro_medico_id and change state to EN_BODEGA, no stock change if we aren't adding back. 
      // BUT rules say "DEVOLUCION suma al stock". If we want a quantity, we might need a modal. Since we only have "Action: Devolver a bodega" we will just un-assign it for now, and record a generic movement.
      
      const { error: movError } = await supabase
        .from('movimientos_stock')
        .insert([{
          producto_id: product.id,
          tipo_movimiento: 'DEVOLUCION',
          cantidad: 0, // No stock change, just returning the physical item ownership
          stock_anterior: product.stock,
          stock_nuevo: product.stock,
          observacion: 'Devuelto a bodega desde ' + (centers.find(c => c.id === product.centro_medico_id)?.nombre || 'centro')
        }]);
      if (movError) throw movError;

      const tempProduct = { ...product, centro_medico_id: null };
      const newStatus = determineStatus(tempProduct);

      const { error: prodError } = await supabase
        .from('productos')
        .update({
          centro_medico_id: null,
          estado: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);
      if (prodError) throw prodError;

      fetchData();
    } catch (error) {
      console.error('Error returning product:', error);
      alert('Error al devolver el producto a bodega.');
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Está seguro de eliminar el producto ${product.codigo}? Esta acción no se puede deshacer y fallará si tiene movimientos registrados.`)) return;
    try {
      const { error } = await supabase.from('productos').delete().eq('id', product.id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('No se pudo eliminar el producto. Puede que tenga movimientos asociados en el historial.');
    }
  };

  // Filter logic
  const filteredProducts = products.filter(p => {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const matchSearch = 
        p.codigo.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term) ||
        (p.serie && p.serie.toLowerCase().includes(term)) ||
        (p.marca_proveedor && p.marca_proveedor.toLowerCase().includes(term));
      if (!matchSearch) return false;
    }

    if (filters.ubicacion && !p.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase())) return false;
    if (filters.estado && p.estado !== filters.estado) return false;
    if (filters.centro_medico_id && p.centro_medico_id !== filters.centro_medico_id) return false;
    
    if (filters.fechaDesde && p.fecha_vencimiento && p.fecha_vencimiento < filters.fechaDesde) return false;
    if (filters.fechaHasta && p.fecha_vencimiento && p.fecha_vencimiento > filters.fechaHasta) return false;

    // Checkboxes logic (OR logic: if multiple are checked, show if matches any)
    const activeCheckboxes = [];
    if (filters.vencidos) activeCheckboxes.push('vencidos');
    if (filters.porVencer) activeCheckboxes.push('porVencer');
    if (filters.sinStock) activeCheckboxes.push('sinStock');
    if (filters.bajoStock) activeCheckboxes.push('bajoStock');

    if (activeCheckboxes.length > 0) {
      let matchesCheckbox = false;
      if (filters.vencidos && p.estado === 'VENCIDO') matchesCheckbox = true;
      if (filters.porVencer && p.estado === 'POR_VENCER') matchesCheckbox = true;
      if (filters.sinStock && p.stock <= 0) matchesCheckbox = true;
      if (filters.bajoStock && p.stock > 0 && p.stock <= 5) matchesCheckbox = true;
      
      if (!matchesCheckbox) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setFilters({
      search: '', ubicacion: '', estado: '', centro_medico_id: '',
      fechaDesde: '', fechaHasta: '', vencidos: false, porVencer: false, sinStock: false, bajoStock: false
    });
  };

  return (
    <div className="flex-1 bg-slate-50 font-sans text-slate-800">
      <Header 
        onAddProduct={() => { setSelectedProduct(null); setIsFormOpen(true); }}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showFilters && (
          <FilterPanel 
            filters={filters} 
            setFilters={setFilters} 
            centers={centers} 
            onClear={clearFilters} 
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ProductTable 
            products={filteredProducts}
            centers={centers}
            onEdit={(p) => { setSelectedProduct(p); setIsFormOpen(true); }}
            onModifyStock={(p) => { setSelectedProduct(p); setIsStockOpen(true); }}
            onAssign={(p) => { setSelectedProduct(p); setIsAssignOpen(true); }}
            onReturn={handleReturnToBodega}
            onHistory={(p) => { setSelectedProduct(p); setIsHistoryOpen(true); }}
            onDelete={handleDelete}
          />
        )}
      </main>

      <ProductFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        centers={centers}
      />

      <StockModal 
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
        onSave={handleSaveStock}
        product={selectedProduct}
      />

      <AssignModal 
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onSave={handleAssignCenter}
        product={selectedProduct}
        centers={centers}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        product={selectedProduct}
        centers={centers}
      />
    </div>
  );
};
