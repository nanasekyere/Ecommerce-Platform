const pool = require('../pool');

module.exports.getProducts = async (filters = {}) => {
  const { categoryId } = filters;

  let queryString = 'SELECT * FROM products';
  const queryParams = [];

  if (categoryId) {
    queryString += ' WHERE category_id = $1';
    queryParams.push(categoryId);
  }

  const result = await pool.query(queryString, queryParams);
  return result.rows;
};

module.exports.getProductById = async (productId) => {
  const queryString = 'SELECT * FROM products WHERE id = $1'
  const params = [productId]

  const result = await pool.query(queryString, params);
  return result.rows;
}
