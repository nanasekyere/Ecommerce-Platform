const ServerError = require("../../lib/error");
const db = require("../../../db/queries/user");
const bcrypt = require("bcrypt");

module.exports.getUser = async (options) => {
  try {
    const {id} = options
    if (!id) {
      throw ServerError.create(401, "User ID is required");
    }

    const result = await db.getUserById(id);

    if (!result) {
      throw ServerError.create(404, "User not found");
    }

    return {
      status: 200,
      data: result
    }
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw ServerError.create(500, "Failed to get user");
  }
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.putUser = async (options) => {
  try {
    const existingUser = await db.getUserById(options.userId);

    if (!existingUser) {
      throw ServerError.create(400, "Could not find User in the database");
    }

    if (options.username && options.username !== existingUser.username) {
      const usernameExists = await db.checkUser(options.username);
      if (usernameExists) {
        throw ServerError.create(409, "Username already exists");
      }
    }

    if (options.password) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
      const hash = await bcrypt.hash(options.password, salt);
      options.password_hash = hash;
    }

    const result = await db.modifyUser({
      id: options.userId,
      username: options.username,
      email: options.email,
      password_hash: options.password_hash,
      address: options.address
    });

    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw ServerError.create(500, "Failed to update user");
  }
};
