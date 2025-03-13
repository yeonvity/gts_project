const express = require('express');
const Book = require('../model/books'); 
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

//получение списка книг
router.get('/', async (req, res) => {
    try {
        const { genre, search } = req.query;
        let query = {};

        if (genre) query.genre = genre;
        if (search) query.title = new RegExp(search, 'i');

        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// добавление книги ( POST /books)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, author, genre, coverImage, price } = req.body;
        const newBook = new Book({ title, author, genre, coverImage, price });
        await newBook.save();
        res.status(201).json({ message: "Книга добавлена!", book: newBook });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// удаление книги
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


// обновление параметров книги 
// PATCH /books/:id
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = ['title', 'author', 'genre', 'coverImage', 'price'];
        const updateFields = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "Нет данных для обновления" });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } 
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Книга не найдена" });
        }

        res.json({ message: "Книга обновлена!", book: updatedBook });
    } catch (error) {
        console.error("Ошибка при обновлении книги:", error);
        res.status(500).json({ message: "Ошибка сервера при обновлении книги" });
    }
});

module.exports = router;
