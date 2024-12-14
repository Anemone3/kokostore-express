import { executeQuery } from "../helpers/poolQuery";

export const createInfoPayment = async (pedido_id, payment_method) => {
  const query = await executeQuery(
    "INSERTO INTO informacion_pago (pedido_id,metodo_pago) VALUES ($1,$2) RETURNING *",
    [pedido_id, payment_method]
  );

  return query;
};

export const getInfoPaymentByUser = async (pedido_id) => {
  const query = await executeQuery(
    "SELECT * FROM informacion_pago WHERE pedido_id = $1",
    [pedido_id]
  );

  return query;
};
