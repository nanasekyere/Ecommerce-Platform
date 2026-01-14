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
}

module.exports.getCartItem = async (itemId) => {
  const result = await pool.query("SELECT * FROM cart_items WHERE id = $1", [itemId]);

  return result.rows[0];
}

module.exports.removeCartItem = async (itemId) => {
  const result = await pool.query("DELETE FROM cart_items WHERE id = $1", [itemId]);

  return result.rowCount > 0;
}

module.exports.updateQuantity = async (itemId, newQuantity) => {
  const result = await pool.query("UPDATE cart_items SET quantity=$2 WHERE id=$1 RETURNING id, quantity", [itemId, newQuantity]);

  return result.rows[0]
}
