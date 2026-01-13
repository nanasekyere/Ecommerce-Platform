const ServerError = require('../../lib/error');
const productsQueries = require('../../../db/queries/products');
const {checkID} = require('../../lib/util')

/**
 * Get all products with optional filtering
 * @param {Object} options
 * @param {number} options.category - Optional category ID to filter by
 * @throws {Error}
 * @return {Promise}
 */
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

/**
 * @param {Object} options
 * @param {String} options.productId Product ID
 * @throws {Error}
 * @return {Promise}
 */
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

/**
 * @param {Object} options
 * @param {String} options.productId Product ID to add
 * @throws {Error}
 * @return {Promise}
 */
module.exports.postProductsByProductidAdd = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: 'postProductsByProductidAdd ok!'
  };
};

