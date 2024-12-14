import { createDetailOrderItem } from "../models/detailoder.model";
import { createOrder, updateOrderTotalQuantity } from "../models/pedido.model";

export const createOrderService = async (req, res, next) => {
    const { usuario_id,metodo_pago, descripcion, cart } = req.body;



   try {
     const order = await createOrder(usuario_id, 0, 0, metodo_pago);

    let montoTotal = 0;
    let cantidad = 0;


    for (const product of cart) {
        const { id, quantity, price, titulo } = product;

        const total = price * quantity;

        await createDetailOrderItem(order.id, id, quantity, price, 0, total, titulo);
        
        montoTotal += total;
        cantidad += quantity;
    }

    //Actualizar pedido con monto total y cantidad total
    await updateOrderTotalQuantity(cantidad, montoTotal, order.id);


    if (!order) {
        return res.status(500).json({ error: "Error al crear el pedido", status: 500 });
    }
    res.status(200).json({ message: "Pedido creado con exito", status: 200, order });
   } catch (error) {
     next(error)
   }

};
