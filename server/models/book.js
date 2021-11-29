const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for book
const bookSchema = new Schema({
  //pass object that describes different data types and properties for a book
  name: String,
  genre: String,
  authorId: String 
});

//making a model (or a collection in a db) which is books and it will have objects inside of it in the bookSchema
module.exports = mongoose.model('Book', bookSchema);