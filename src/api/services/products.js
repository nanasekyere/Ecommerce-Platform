const ServerError = require('../../lib/error');
const db = require('../../../db/queries/products');
const {checkID} = require('../../lib/util')

module.exports.getProducts = async (options) => {
  try {
    const filters = {};

    if (options.category) {
      filters.categoryId = checkID(options.category)
    }

    const products = await db.getProducts(filters);

    return {
      status: 200,
      data: products
    };
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }

    throw ServerError.create(500, 'Failed to fetch products');
  }
};

module.exports.getProductsByProductid = async (options) => {
  try {
    const productId = checkID(options.productId)

    const product = await db.getProductById(productId)

    if (!product) {
      throw ServerError.create(404, 'No product with id: ' + productId);
    }
    return {
      status: 200,
      data: product
    }

  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }

    throw ServerError.create(500, 'Failed to fetch product from product id: ' + options.productId);
  }

};
