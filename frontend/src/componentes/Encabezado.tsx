interface Props {
  mesa: number | null;
}

export function Encabezado({ mesa }: Props) {
  return (
    <h1>{mesa === null ? 'Para retirar en la barra' : `Mesa ${mesa}`}</h1>
  );
}