const ServerError = require('../../lib/error');
const bcrypt = require('bcrypt');
const db = require('../../../db/queries/user')

module.exports.register = async (options) => {
  try {
    const { username, email, password, address } = options;

    if (!username || !email || !password) {
      throw ServerError.create(400, 'Username, email, and password are required');
    }

    const existingUser = await db.checkUser(username);
    if (existingUser) {
      throw ServerError.create(409, 'Username already exists');
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
    throw ServerError.create(500, 'Failed to create user');
  }
};

