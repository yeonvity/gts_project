const express = require('express');
const router = express.Router();
const Order = require('../model/orders');
const authMiddleware = require('../middleware/auth');

// оформление нового заказа
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const newOrder = new Order({
            userId: req.user.id,
            items,
            totalAmount
        });
        await newOrder.save();
        res.json({ message: 'Заказ успешно оформлен!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;
