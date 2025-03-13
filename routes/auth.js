const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../model/users');

const router = express.Router();
const JWT_SECRET = "123456"; 

// регистрация пользователя
router.post('/register', [
    body('name').notEmpty().withMessage("Имя обязательно"),
    body('email').isEmail().withMessage("Некорректный email"),
    body('password').isLength({ min: 6 }).withMessage("Пароль должен содержать минимум 6 символов")
], async (req, res) => {
    console.log("Запрос на регистрацию:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Некорректные данные", errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Пользователь уже существует" });
        }

        // хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user' 
        });

        await newUser.save();

        // генерируем токен
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("Токен при регистрации:", token);

        res.status(201).json({ 
            message: "Регистрация успешна!", 
            token, 
            user: { name: newUser.name, role: newUser.role }  // отправляем user
        });

    } catch (error) {
        console.error("Ошибка сервера:", error);
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// вход в систему
router.post('/login', [
    body('email').isEmail().withMessage("Некорректный email"),
    body('password').notEmpty().withMessage("Пароль обязателен")
], async (req, res) => {
    console.log("Запрос на вход:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Некорректные данные", errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Неверный пароль или email" });
        }

        // проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный пароль или email" });
        }

        // генерируем JWT-токен
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log("Токен при входе:", token); // логируем токен

        res.json({ 
            message: "Вход успешен!", 
            token, 
            user: { id: user._id, name: user.name, role: user.role } 
        });
        

    } catch (error) {
        console.error("Ошибка сервера:", error);
        res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
