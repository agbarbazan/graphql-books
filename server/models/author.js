const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for author
const authorSchema = new Schema({
  name: String,
  age: Number,
});

//making a model (or a collection in a db) which is books and it will have objects inside of it in the bookSchema
module.exports = mongoose.model('Author', authorSchema);