const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  name:String,
  restaurant:String,
  location:String
});

module.exports = mongoose.model('Food',foodSchema);
