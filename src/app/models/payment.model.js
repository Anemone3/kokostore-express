import { executeQuery } from "../helpers/poolQuery.js";

export const getPaymentMethods = async () => {
  const response = await executeQuery("SELECT * FROM metodo_pago");
  return response;
};


export const getPaymentMethodsById = async (id) => {
  const response = await executeQuery("SELECT * FROM metodo_pago WHERE id = $1", [id]);
  return response;
};