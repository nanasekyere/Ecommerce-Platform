const ServerError = require('../../lib/error');
const productsQueries = require('../../../db/queries/products');
const {checkID} = require('../../lib/util')

module.exports.getProducts = async (options) => {
  try {
    const filters = {};

    if (options.category) {
      filters.categoryId = checkID(options.category)
    }

    const products = await productsQueries.getProducts(filters);

    return {
      status: 200,
      data: products
    };
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }

    throw new ServerError({
      status: 500,
      error: 'Failed to fetch products'
    });
  }
};

module.exports.getProductsByProductid = async (options) => {
  try {
    const productId = checkID(options.productId)

    const product = await productsQueries.getProductsByID(productId)

    return {
      status: 200,
      data: product[0]
    }

  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }

    throw new ServerError({
      status: 500,
      error: 'Failed to fetch product from product id: ' + options.productId
    });
  }

};
