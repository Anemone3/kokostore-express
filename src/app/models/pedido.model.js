import { executeQuery } from "../helpers/poolQuery.js";
import { pool } from "../../config/connection.database.js";

export const createOrderService = async (
  usuario_id,
  metodo_pago,
  cart
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Creamos el pedido
    const orderResult = await client.query(
      "INSERT INTO pedido (usuario_id, metodo_pago, cantidad_total, monto_total) VALUES ($1, $2, $3, $4) RETURNING *",
      [usuario_id, metodo_pago, 0, 0]
    );

    const order = orderResult.rows[0]; // Asegúrate de usar correctamente el objeto devuelto

    let montoTotal = 0;
    let cantidad = 0;

    for (const product of cart) {
      const { id, quantity, price, titulo } = product;

      const total = price * quantity;

      await client.query(
        "INSERT INTO detalle_pedido (pedido_id, product_id, quantity, unit_price, descuento, total, description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [order.id, id, quantity, price, 0, total, titulo]
      );

      montoTotal += total;
      cantidad += quantity;
    }

    await client.query(
      "UPDATE pedido SET cantidad_total = $1, monto_total = $2 WHERE id = $3 RETURNING *",
      [cantidad, montoTotal, order.id]
    );

    const { rows } = await client.query("SELECT * FROM pedido WHERE id = $1", [
      order.id,
    ]);

    await client.query("COMMIT");

    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en la transacción: ", error);
    throw new Error("Error en la transacción: ", error);
  } finally {
    client.release();
  }
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
};


export const confirmOrder = async (id) => {
  const query = await executeQuery(
    "UPDATE pedido SET descripcion = 'confirmado' WHERE id = $1  RETURNING *",
    [id]
  );

  if (query.length === 0) {
    throw new Error("No se encontro el pedido, o ya se encuentra confirmado.");
  }

  return query;
}