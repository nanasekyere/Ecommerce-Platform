const { param } = require("../../src/api");
const pool = require("../pool");

module.exports.checkUser = async (username) => {
  const result = await pool.query(
    "SELECT username, password_hash FROM users WHERE username = $1",
    [username]
  );

  return result.rows[0];
};

module.exports.getUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, username, email FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

module.exports.createUser = async (newUser) => {
  const { id, username, email, password_hash, address } = newUser;

  const result = await pool.query(
    "INSERT into users (username, email, password_hash, address) VALUES ($1, $2, $3, $4) RETURNING id, username, email, address, created_at",
    [username, email, password_hash, address]
  );

  return result.rows[0];
};
