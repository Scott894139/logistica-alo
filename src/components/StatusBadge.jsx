export const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'EN_BODEGA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ASIGNADO':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'SIN_STOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'POR_VENCER':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'VENCIDO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'EN_BODEGA': return 'En Bodega';
      case 'ASIGNADO': return 'Asignado';
      case 'SIN_STOCK': return 'Sin Stock';
      case 'POR_VENCER': return 'Por Vencer';
      case 'VENCIDO': return 'Vencido';
      default: return status;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};
