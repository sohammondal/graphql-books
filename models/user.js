const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: String
});

module.exports = mongoose.Model("User", User);
