const jwt = require('jsonwebtoken');

const JWT_SECRET = "123456";

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: "Нет доступа, требуется токен" });
    }

    // проверака чтобы токен начинался с "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Неверный формат токена" });
    }

    const token = authHeader.split(' ')[1]; // берем сам токен без "Bearer "

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // декодированные данные (id, email)
        next();
    } catch (error) {
        return res.status(401).json({ message: "Неверный или просроченный токен" });
    }
};
