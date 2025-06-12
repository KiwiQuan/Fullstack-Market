import db from "#db/client";

export async function createOrder(date, userId, note) {
  const sql = `
    INSERT INTO orders
        (date, user_id, note)
    VALUES
        ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [order],
  } = await db.query(sql, [date, userId, note]);
  return order;
}

// sends an array of all orders made by the user that include product from route params
export async function getOrdersByUserIdThatContainsProductId(
  userId,
  productId
) {
  const sql = `
SELECT orders.*
FROM orders
JOIN orders_products ON orders.id = orders_products.order_id
WHERE orders.user_id = $1 AND orders_products.product_id = $2;
  `;
  const { rows: orders } = await db.query(sql, [userId, productId]);
  return orders;
}

export async function getOrdersByUserId(userId) {
  const sql = `
    SELECT *
    FROM orders
    WHERE user_id = $1
    `;
  const { rows: orders } = await db.query(sql, [userId]);
  return orders;
}

export async function getOrderByUserId(userId, orderId) {
  const sql = `
    SELECT *
    FROM orders
    WHERE user_id = $1 AND id = $2
    `;
  const {
    rows: [order],
  } = await db.query(sql, [userId, orderId]);
  return order;
}

export async function increaseOrderProductQuantity(
  orderId,
  productId,
  quantity
) {
  const sql = `  INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (order_id, product_id)
    DO UPDATE SET quantity = orders_products.quantity + EXCLUDED.quantity
    RETURNING *;
    `;
  const values = [orderId, productId, quantity];
  const {
    rows: [order_products],
  } = await db.query(sql, values);
  return order_products;
}

export async function getProductsByOrderId(orderId) {
  const sql = `
    SELECT *
    FROM orders_products
    WHERE order_id = $1
    `;
  const { rows: products } = await db.query(sql, [orderId]);
  return products;
}
