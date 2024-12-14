import { executeQuery } from "../helpers/poolQuery";

export const createOrder = async (
  usuario_id,
  monto_total,
  cantidad_total,
  metodo_pago
) => {
  const query = await executeQuery(
    "INSERT INTO pedido (usuario_id,metodo_pago,cantidad_total,monto_total) VALUES ($1,$2,$3,$4) RETURNING *",
    [usuario_id, metodo_pago, cantidad_total, monto_total]
  );

  return query;
};

export const cancelOrder = async (id) => {
  const query = await executeQuery(
    "UPDATE pedido SET descripcion = 'cancelado' WHERE id = $1  RETURNING *",
    [id]
  );

  if (query.length === 0) {
    throw new Error("No se encontro el pedido, o ya se encuentra cancelado.");
  }

  return query;
};


export const getOrdersByUser = async (usuario_id) => {
    const query = await executeQuery(
        "SELECT * FROM pedido p INNER JOIN detalle_pedido dp ON p.id = dp.pedido_id WHERE p.usuario_id = $1",
        [usuario_id]
    );

    return query;
}


export const updateOrderTotalQuantity = async (cantidad,monto_total,pedido_id) =>{
    const query = await executeQuery(
        "UPDATE pedido SET cantidad_total = $1, monto_total = $2 WHERE id = $3 RETURNING *",
        [cantidad, monto_total, pedido_id]
    );

    return query;
}