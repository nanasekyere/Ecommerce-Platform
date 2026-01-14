const express = require('express');
const userService = require('../services/user');

const router = new express.Router();
const { requireAuth } = require('../../config/passport');



/**
 * Get the current user's profile
 */
router.get('/', requireAuth, async (req, res, next) => {
  const options = {
    id: req.user.id
  };

  try {
    const result = await userService.getUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Update current user's profile information
 */
router.put('/', requireAuth, async (req, res, next) => {
  const options = {
    ...req.body,
    userId: req.user.id
  }

  try {
    const result = await userService.putUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Delete the current user's account permanently
 */
router.delete('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await userService.deleteUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Create order using items in cart
 */
router.post('/create-order', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await user.postUserCreateOrder(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});


/**
 * Get all orders for the current user
 */
router.get('/orders', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await user.getUserOrders(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Cancel a pending order (only possible if not yet shipped)
 */
router.put('/orders/:orderId', async (req, res, next) => {
  const options = {
    body: req.body,
    orderId: req.params['orderId']
  };

  try {
    const result = await user.putUserOrdersByOrderid(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Get details of a specific order
 */
router.get('/orders/:orderId', async (req, res, next) => {
  const options = {
    orderId: req.params['orderId']
  };

  try {
    const result = await user.getUserOrdersByOrderid(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
