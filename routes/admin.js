const express = require('express');
const User = require('../model/users');
const Book = require('../model/books');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// получение всех users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // исключаем пароль
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// получение всех книг
router.get('/books', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// удаление user
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Пользователь удален" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
