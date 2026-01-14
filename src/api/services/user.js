const ServerError = require("../../lib/error");
const db = require("../../../db/queries/user");
const bcrypt = require("bcrypt");

module.exports.getUser = async (options) => {
  try {
    const {id} = options
    if (!id) {
      throw new ServerError({
        status: 401,
        error: "User ID is required",
      });
    }

    const result = await db.getUserById(id);

    if (!result) {
      throw new ServerError({
        status: 404,
        error: "User not found",
      });
    }

    return {
      status: 200,
      data: result
    }
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw new ServerError({
      status: 500,
      error: "Failed to get user",
    });
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
      throw new ServerError({
        status: 400,
        error: "Could not find User in the database",
      });
    }

    if (options.username && options.username !== existingUser.username) {
      const usernameExists = await db.checkUser(options.username);
      if (usernameExists) {
        throw new ServerError({
          status: 409,
          error: "Username already exists",
        });
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
    throw new ServerError({
      status: 500,
      error: "Failed to update user",
    });
  }
};
