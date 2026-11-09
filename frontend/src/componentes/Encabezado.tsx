interface Props {
  mesa: number | null;
}

export function Encabezado({ mesa }: Props) {
  return <h1>Mesa {mesa}</h1>;
}