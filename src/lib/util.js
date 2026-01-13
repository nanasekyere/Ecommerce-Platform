const ServerError = require("./error");

module.exports.checkID = (id) => {
  if (isNaN(id)) {
    throw new ServerError({
      status: 400,
      error: "Invalid category ID",
    });
  }
  return parseInt(id, 10);
};
