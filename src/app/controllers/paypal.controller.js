import paypal from "../../config/connection.paypal.js";
import { getDetailOrderItemsByOrder } from "../models/detailoder.model.js";
import { confirmOrder } from "../models/pedido.model.js";

export const createPayment = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "El id del pedido es requerido" });
  }

  const items = await getDetailOrderItemsByOrder(id);
  const totalPayment = items[0].monto_total;

  if (items.length === 0) {
    return res
      .status(404)
      .json({ message: "No se encontraron items para el pedido" });
  }
  console.log(items);

  const wrapItems = items.map((item) => ({
    name: item.description,
    sku: `SKU-${item.product_id}`,
    price: item.unit_price,
    currency: "USD",
    quantity: item.quantity,
  }));

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    },
    transactions: [
      {
        item_list: {
          items: wrapItems,
        },
        amount: {
          currency: "USD",
          total: totalPayment.toString(),
        },
        description: "This is the payment description.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      return res
        .status(500)
        .json({ error: error.message ?? "Error en el pago" });
    } else {
      console.log("Create Payment Response");

      const redirectUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      res.status(200).json({ redirectUrl });
    }
  });
};

export const executePayment = (req, res, next) => {
  const {id} = req.params;
  const { total } = req.body;
  const { paymentId, PayerID } = req.query;

  if(!paymentId || !PayerID) {
    return res.status(400).json({ message: "El paymentId y el PayerID son requeridos" });
  }

  if(!id || !total) {
    return res.status(400).json({ message: "El id y el total son requeridos" });
  }


  const execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: total,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        return res
          .status(500)
          .json({ error: error.message ?? "Error en el pago" });
      } else {
        try {
          await confirmOrder(id);
          console.log("Todo salio bien");
          res.status(200).json({ payment });
        } catch (error) {
          next(error);
        }
      }
    }
  );
};
