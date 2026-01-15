const express = require("express");
const router = new express.Router();
const { requireAuth } = require('../../../config/passport');
const orderService = require("../services/orders")

router.use(requireAuth);

/**
 * Get all orders for the current user
 */
router.get('/', async (req, res, next) => {
  const options = {
    userId: req.user.id
  };

  try {
    const result = await orderService.getAllOrders(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});


/**
 * Get details of a specific order
 */
router.get('/:orderId', async (req, res, next) => {
  const options = {
    orderId: req.params['orderId']
  };

  try {
    const result = await orderService.getOrderById(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
