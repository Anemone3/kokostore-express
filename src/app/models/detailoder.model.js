

export const createDetailOrderItem = async(pedido_id,product_id,quantity,unit_price,descuento,total,description) =>{
    const query = await executeQuery(
        "INSERT INTO pedido_item (pedido_id, producto_id, quantity, unit_price, descuento, total, description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [pedido_id, product_id, quantity, unit_price, descuento, total, description]
    );

    return query;
}

export const getDetailOrderItemsByOrder = async(pedido_id) =>{
    const query = await executeQuery(
        "SELECT * FROM detalle_pedido WHERE pedido_id = $1",
        [pedido_id]
    );

    return query;
}

