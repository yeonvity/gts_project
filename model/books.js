const express = require('express');
const Book = require('../model/books');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// книги с фильтрацией
router.get('/', async (req, res) => {
    try {
        const { genre, search } = req.query;
        let query = {};

        if (genre) query.genre = genre;
        if (search) query.title = new RegExp(search, 'i'); // поиск по названию

        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// добавление книги (только админ)
router.post('/add', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, author, genre, description, coverImage, price } = req.body;
        const newBook = new Book({ title, author, genre, description, coverImage, price });
        await newBook.save();
        res.status(201).json({ message: "Книга добавлена!" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// удаление книги (только админ)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Книга не найдена" });
        }

        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Книга удалена" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
