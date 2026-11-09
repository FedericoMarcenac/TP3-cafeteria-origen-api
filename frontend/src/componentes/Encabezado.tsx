interface Props {
  mesa: number | null;
}

export function Encabezado({ mesa }: Props) {
  return (
    <p className="mb-0">
      {mesa === null ? 'Para retirar en la barra' : `Mesa ${mesa}`}
    </p>
  );
}