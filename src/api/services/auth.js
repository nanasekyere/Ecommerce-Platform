const ServerError = require('../../lib/error');
const bcrypt = require('bcrypt');
const db = require('../../../db/queries/user')
/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.postAuthLogin = async (options) => {
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
    data: 'postAuthLogin ok!'
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getAuthLogout = async (options) => {
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
    data: 'getAuthLogout ok!'
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.register = async (options) => {
  try {
    const { username, email, password, address } = options;

    if (!username || !email || !password) {
      throw new ServerError({
        status: 400,
        error: 'Username, email, and password are required'
      });
    }

    const existingUser = await db.checkUser(username);
    if (existingUser) {
      throw new ServerError({
        status: 409,
        error: 'Username already exists'
      });
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUser = await db.createUser({
      username, email, password_hash: hash, address
    })

    return {
      status: 201,
      data: newUser
    }

  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw new ServerError({
      status: 500,
      error: 'Failed to create user'
    });
  }
};

