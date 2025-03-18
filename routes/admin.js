const express = require('express');
const Book = require('../model/books');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// получение всех книг
router.get('/books', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// добавить новую книгу
router.post('/books/add', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, author, genre, coverImage, price } = req.body;

        if (!title || !author || !genre || !price) {
            return res.status(400).json({ message: "Заполните обязательные поля!" });
        }

        const newBook = new Book({
            title,
            author,
            genre,
            coverImage,
            price
        });

        await newBook.save();
        res.status(201).json({ message: "Книга добавлена!", book: newBook });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при добавлении книги", error });
    }
});

// удалить книгу по ID
router.delete('/books/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({});
        }

        res.json({});
    } catch (error) {
        res.status(500).json({ error });
    }
});

// обновить книгу по ID
router.patch('/books/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedBook) {
            return res.status(404).json({});
        }

        res.json({});
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
