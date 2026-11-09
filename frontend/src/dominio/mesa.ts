export function leerMesa(search: string): number | null {
  const valor = new URLSearchParams(search).get('mesa');
  return valor === null ? null : Number(valor);
}
