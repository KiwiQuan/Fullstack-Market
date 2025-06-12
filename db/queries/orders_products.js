import db from "#db/client";

export async function createOrderProduct(orderId, productId, quantity) {
  const sql = `
        INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
  const values = [orderId, productId, quantity];
  const {
    rows: [order_products],
  } = await db.query(sql, values);
  return order_products;
}
