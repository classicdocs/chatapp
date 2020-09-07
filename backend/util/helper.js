const mongoose = require('mongoose');

exports.getIds = (ids) => {
  return ids.map(id => mongoose.Types.ObjectId(id));
}

