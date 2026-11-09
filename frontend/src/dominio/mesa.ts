export function leerMesa(search: string): number | null {
  const valor = new URLSearchParams(search).get('mesa');
  if (valor === null || !/^[1-9]\d*$/.test(valor)) return null;
  return Number(valor);
}