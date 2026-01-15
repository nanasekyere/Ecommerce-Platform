const ServerError = require("../../lib/error");
const db = require("../../../db/queries/orders");

module.exports.getAllOrders = async (options) => {
  try {
    const result = await db.getOrders(options.userId);

    if (!result) {
      throw ServerError.create(404, "Failed to retrieve orders from database");
    }

    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw ServerError.create(500, "Failed to get orders");
  }
};

module.exports.getOrderById = async (options) => {
  try {
    const result = await db.getOrder(options.orderId);

    if (!result) {
      throw ServerError.create(
        404,
        `Failed to retrieve order with ID ${options.orderId} from database`
      );
    }

    return {
      status: 200,
      data: result,
    };

  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw ServerError.create(500, "Failed to get order");
  }
};
