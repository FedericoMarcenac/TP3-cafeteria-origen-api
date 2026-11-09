export function formatearPrecio(valor: number): string {
  const conPuntos = String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${conPuntos}`;
}