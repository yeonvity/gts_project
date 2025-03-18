const express = require('express');
const router = express.Router();
const User = require('../model/users');
const Order = require('../model/orders');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Получение профиля и истории заказов
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ user, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Обновление данных профиля
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { name, email, oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        let updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({ message: 'Введите текущий пароль' });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Текущий пароль неверный' });
            }

            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
        res.json({ message: 'Профиль обновлен', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});


module.exports = router;
