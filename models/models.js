const mongoose = require('mongoose');
const schema = mongoose.Schema;
exports.users = new schema({
  userName: String,
  password: String
})