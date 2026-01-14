const ServerError = require("../../lib/error");
const db = require("../../../db/queries/cart");
const productDb = require("../../../db/queries/products");

module.exports.getCart = async (userId) => {
  try {
    const items = await db.getCart(userId);

    return {
      status: 200,
      data: items,
    };
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw ServerError.create(500, "Failed to get Cart items");
  }
};

module.exports.getCartItem = async (itemId) => {
  try {
    const item = await db.getCartItem(itemId);

    if (!item) {
      throw ServerError.create(404, "Failed to get cart item from database");
    }

    return {
      status: 200,
      data: item,
    };
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw ServerError.create(500, "Failed to get Cart item");
  }
}

module.exports.removeCartItem = async (id) => {
  try {
    const itemDeleted = await db.removeCartItem(id);

    if (!itemDeleted) {
      throw ServerError.create(404, "Failed to delete cart item from database");
    }

    return {
      status: 204,
      data: true
    }
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw ServerError.create(500, "Failed to delete Cart item");
  }
};

module.exports.changeQuantity = async ({itemId, productId, newQuantity}) => {
  try {
    if (newQuantity === 0) {
      return await this.removeCartItem(itemId)
    }

    const product = await productDb.getProductById(productId);
    if (!product) {
      throw ServerError.create(404, "Failed to retrieve product from ID " + productId);
    }

    const stock = product.stock
    if (newQuantity > stock) {
     throw ServerError.create(409, `Insufficient stock. Requested: ${newQuantity}, Available: ${stock}`);
    }

    const updatedItem = await db.updateQuantity(itemId, newQuantity);

    if (!updatedItem) { throw ServerError.create(500, 'There was an error updating the cart item with ID: ' + itemId)}

    return {
      status: 200,
      data: updatedItem
    }


  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw ServerError.create(500, "Failed to change cart item quantity");
  }
}
