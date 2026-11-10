interface Props {
  mensaje: string;
}

export function ErrorDelPedido({ mensaje }: Props) {
  return (
    <div role="alert" className="alert alert-danger">
      <p className="fw-semibold mb-1">No pudimos enviar tu pedido</p>
      <p className="mb-0">{mensaje}</p>
    </div>
  );
}
