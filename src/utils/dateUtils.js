export const getDaysDifference = (targetDate) => {
  if (!targetDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const determineStatus = (product) => {
  if (product.stock <= 0) return 'SIN_STOCK';
  
  if (product.fecha_vencimiento) {
    const daysLeft = getDaysDifference(product.fecha_vencimiento);
    if (daysLeft < 0) return 'VENCIDO';
    if (daysLeft <= 90) return 'POR_VENCER';
  }

  if (product.centro_medico_id) {
    return 'ASIGNADO';
  }
  
  return 'EN_BODEGA';
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  // Add timezone offset correction to display the actual saved date
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};
