const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    coverImage: { type: String }, // URL картинки
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;
