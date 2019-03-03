const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Books
const bookSchema = new Schema({
    book: {
        type: String,
        required: [true, 'The book name is required']
    },
    count: Number
});

// Model for Books
const books = mongoose.model('books', bookSchema);

module.exports = books;