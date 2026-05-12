export const calculateNewStock = (currentStock, movementType, quantity) => {
  const stock = Number(currentStock);
  const qty = Number(quantity);

  switch (movementType) {
    case 'INGRESO':
    case 'DEVOLUCION':
      return stock + qty;
    case 'SALIDA':
    case 'ASIGNACION':
      return stock - qty;
    case 'AJUSTE':
      return qty; // In AJUSTE, the quantity is the new stock
    default:
      return stock;
  }
};
