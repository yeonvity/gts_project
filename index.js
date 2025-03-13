const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile'); 
const orderRoutes = require('./routes/orders');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// маршруты
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/admin-api', adminRoutes); 
app.use('/profile', profileRoutes);
app.use('/orders-api', orderRoutes);

// страницы
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/catalog', (req, res) => res.sendFile(path.join(__dirname, 'public', 'catalog.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cart.html')));
app.get('/profile/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});


app.get('/', (req, res) => {
    res.redirect('/catalog');
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
