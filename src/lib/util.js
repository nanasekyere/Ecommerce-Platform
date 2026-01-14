const ServerError = require("./error");

module.exports.checkID = (id) => {
  if (isNaN(id)) {
    throw ServerError.create(400, "Invalid category ID");
  }
  return parseInt(id, 10);
};
