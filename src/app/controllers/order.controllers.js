import { createOrderService, getOrdersByUser } from "../models/pedido.model.js";

export const createOrder = async (req, res, next) => {
  const { usuario_id, metodo_pago, cart } = req.body;

  try {
    if (!Array.isArray(cart)) {
      return res
        .status(400)
        .json({ message: "El carrito debe ser un array de objetos." });
    }

    if (typeof usuario_id !== "number" || isNaN(usuario_id)) {
      return res
        .status(400)
        .json({ message: "Se necesita el id del usuario." });
    }

    const order = await createOrderService(usuario_id, metodo_pago, cart);

    res
      .status(200)
      .json({ message: "Pedido creado con exito", status: "success", order });
  } catch (error) {
    next(error);
    res.status(500).json({ error: "Error en crear un pedido" });
  }
};

export const orderUserId = async (req, res, next) => {
  const { id } = req.params;

  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Se necesita el id del usuario." });
  }
  try {
    const order = await getOrdersByUser(userId);

    if (order.length > 0) {
      return res.status(200).json({ order });
    }

    res.status(200).json({ message: "No hay pedidos registrados." });
  } catch (error) {
    next(error);

    res.status(500).json({ error: "Error al obtener pedidos de un usuario." });
  }
};
