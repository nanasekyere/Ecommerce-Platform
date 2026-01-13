const express = require('express');
const products = require('../services/products');

const router = new express.Router();


/**
 * Retrieve all available products
 * Query params:
 *   - category: Optional category ID to filter products
 */
router.get('/', async (req, res, next) => {
  const options = {
    category: req.query.category
  };

  try {
    const result = await products.getProducts(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Retrieve details of a specific product
 */
router.get('/:productId', async (req, res, next) => {
  const options = {
    productId: req.params['productId']
  };

  try {
    const result = await products.getProductsByProductid(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Add product to user's cart with specified quantity
 */
router.post('/:productId/add', async (req, res, next) => {
  const options = {
    body: req.body,
    productId: req.params['productId']
  };

  try {
    const result = await products.postProductsByProductidAdd(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
