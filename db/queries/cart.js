const pool = require("../pool");

module.exports.getCart = async (userId) => {
  const result = await pool.query(
    `SELECT
      cart_items.id,
      cart_items.product_id,
      cart_items.quantity,
      products.name,
      products.description,
      products.price,
      products.image_url,
      products.stock,
      (cart_items.quantity * products.price) as subtotal
    FROM cart_items
    JOIN products ON cart_items.product_id = products.id
    WHERE cart_items.user_id = $1`,
    [userId]
  );

  return result.rows;
};

module.exports.getCartItem = async (itemId) => {
  const result = await pool.query("SELECT * FROM cart_items WHERE id = $1", [
    itemId,
  ]);

  return result.rows[0];
};

module.exports.removeCartItem = async (itemId) => {
  const result = await pool.query("DELETE FROM cart_items WHERE id = $1", [
    itemId,
  ]);

  return result.rowCount > 0;
};

module.exports.updateQuantity = async (itemId, newQuantity) => {
  const result = await pool.query(
    "UPDATE cart_items SET quantity=$2 WHERE id=$1 RETURNING id, quantity",
    [itemId, newQuantity]
  );

  return result.rows[0];
};

module.exports.createOrder = async (details) => {
  const { userId, products, total } = details;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id",
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    for (const product of products) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          orderId,
          product.productId,
          product.productName,
          product.quantity,
          product.price,
          product.subtotal,
        ]
      );

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [product.quantity, product.productId]
      );
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

    await client.query('COMMIT');

    return orderId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
