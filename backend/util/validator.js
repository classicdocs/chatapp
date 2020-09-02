
function validateParams(params, response) {

  Object.keys(params).forEach(key => {
    if (params[key] == undefined) {
      response.status(400).send(key + " is required");
    }
  });
}

module.exports = validateParams;