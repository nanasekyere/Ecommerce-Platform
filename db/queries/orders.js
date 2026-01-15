const pool = require("../pool");

module.exports.getOrders = async (userId) => {
  const ordersResult = await pool.query(
    "SELECT id, status, total, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );

  const orders = [];

  for (const order of ordersResult.rows) {
    const itemsResult = await pool.query(
      "SELECT product_id, product_name, quantity, price, subtotal FROM order_items WHERE order_id = $1",
      [order.id]
    );

    orders.push({
      id: order.id,
      status: order.status,
      total: order.total,
      created_at: order.created_at,
      items: itemsResult.rows,
    });
  }

  return orders;
};

module.exports.getOrder = async (orderId) => {
  const orderResult = await pool.query(
    "SELECT id, status, total, created_at FROM orders WHERE id = $1",
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const itemsResult = await pool.query(
    "SELECT product_id, product_name, quantity, price, subtotal FROM order_items WHERE order_id = $1",
    [orderId]
  );

  const order = orderResult.rows[0];

  return {
    id: order.id,
    status: order.status,
    total: order.total,
    created_at: order.created_at,
    items: itemsResult.rows,
  };
}
