const express = require("express");
const cartService = require("../services/cart");

const router = new express.Router();
const { requireAuth } = require("../../config/passport");
const { use } = require("passport");

router.use(requireAuth);

router.use("/:itemId", async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const item = await cartService.getCartItem(itemId);
    req.item = item;
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Get all cart items if any
 */
router.get("/", async (req, res, next) => {
  const userID = req.user.id;

  try {
    const result = await cartService.getCart(userID);
    res.status(result.status || 200).send(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * Remove product from cart by ID
 */
router.delete("/:itemId", async (req, res, next) => {
  const {itemId} = req.params
  try {
    const result = await cartService.removeCartItem(itemId);
    res.status(result.status || 200).send(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * Increase/Decrease number of item in cart
 */
router.put('/:itemId', async (req, res, next) => {
  const options = {
    itemId: req.item.id,
    productId: req.item.product_id,
    newQuantity: req.body.quantity
  };

  try {
    const result = await cartService.changeQuantity(options);
    res.status(result.status || 200).send(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
