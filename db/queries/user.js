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
  const { username, email, password_hash, address } = newUser;

  const result = await pool.query(
    "INSERT into users (username, email, password_hash, address) VALUES ($1, $2, $3, $4) RETURNING id, username, email, address, created_at",
    [username, email, password_hash, address]
  );

  return result.rows[0];
};

module.exports.modifyUser = async (user) => {
  const { id, username, email, password_hash, address } = user;

  const fields = [];
  const values = [id];
  let paramCount = 1;

  if (username !== undefined) {
    paramCount++;
    fields.push(`username=$${paramCount}`);
    values.push(username);
  }

  if (email !== undefined) {
    paramCount++;
    fields.push(`email=$${paramCount}`);
    values.push(email);
  }

  if (password_hash !== undefined) {
    paramCount++;
    fields.push(`password_hash=$${paramCount}`);
    values.push(password_hash);
  }

  if (address !== undefined) {
    paramCount++;
    fields.push(`address=$${paramCount}`);
    values.push(address);
  }

  if (fields.length === 0) {
    return null;
  }

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id=$1 RETURNING id, username, email, address, updated_at`;
  const result = await pool.query(query, values);

  return result.rows[0];
};
