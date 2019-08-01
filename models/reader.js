const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reader = new Schema({
  name: String,
  bookList: Object
});
module.exports = mongoose.model("Reader", Reader);
