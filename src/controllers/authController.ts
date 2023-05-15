import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Проверяем, существует ли пользователь с таким же именем
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
        }

        // Хешируем пароль перед сохранением в базе данных
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        console.error('Ошибка регистрации пользователя:', error);
        res.status(500).json({ message: 'Ошибка регистрации пользователя' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Находим пользователя по имени
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        // Проверяем правильность пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        // Генерируем JWT-токен
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Ошибка аутентификации пользователя:', error);
        res.status(500).json({ message: 'Ошибка аутентификации пользователя' });
    }
};