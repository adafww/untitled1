import express from 'express';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware/authMiddleware';

const app = express();

// ...

// Регистрация маршрутов аутентификации
app.use('/api/auth', authRoutes);

// Пример защищенного маршрута, требующего аутентификации
app.get('/api/protected', authenticateToken, (req, res) => {
    // Обработка защищенного маршрута
    res.json({ message: 'Вы авторизованы для доступа к защищенному маршруту' });
});

// ...

export default app;