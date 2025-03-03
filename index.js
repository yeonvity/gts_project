const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// страницы
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// авторизация
app.use(authRoutes);


app.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: "Добро пожаловать!", user: req.user });
});

// подключение к MongoDB
const uri = "mongodb+srv://aidakerimbayeva04:WKTtY6JtCYHpOQ9L@cluster0.huuql.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0";
const start = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB подключен через Mongoose");

        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });

    } catch (error) {
        console.error("Ошибка подключения к MongoDB:", error);
        process.exit(1);
    }
};

start();
