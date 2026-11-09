export const CANTIDAD_DE_MESAS = 12;

export function existeMesa(id: number): boolean {
  return id >= 1 && id <= CANTIDAD_DE_MESAS;
}
