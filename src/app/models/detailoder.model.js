import { executeQuery } from "../helpers/poolQuery.js";


export const createDetailOrderItem = async(pedido_id,product_id,quantity,unit_price,descuento,total,description) =>{
    const query = await executeQuery(
        "INSERT INTO detalle_pedido (pedido_id, producto_id, quantity, unit_price, descuento, total, description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [pedido_id, product_id, quantity, unit_price, descuento, total, description]
    );

    return query;
}

export const getDetailOrderItemsByOrder = async(pedido_id) =>{
    const query = await executeQuery(
        "SELECT  product_id,description, quantity, unit_price,descuento ,total, cantidad_total,monto_total FROM detalle_pedido dp INNER JOIN pedido p ON dp.pedido_id = p.id WHERE pedido_id = $1",
        [pedido_id]
    );

    return query;
}

