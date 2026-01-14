const ServerError = require('../../lib/error');
const bcrypt = require('bcrypt');
const db = require('../../../db/queries/user')

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

    const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS)
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

