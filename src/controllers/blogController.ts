import { Request, Response } from 'express';
import BlogPost, { IBlogPost } from '../models/BlogPost';

export const createBlogPost = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const author = req['user'].userId; // Get the user ID from the authenticated user

        // Create a new blog post
        const blogPost: IBlogPost = new BlogPost({ message, author });
        await blogPost.save();

        res.status(201).json({ message: 'Blog post created successfully' });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Error creating blog post' });
    }
};

export const getBlogPosts = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1; // Получаем номер страницы из параметров запроса (по умолчанию 1)
        const perPage = 20; // Количество записей на странице

        const totalPosts = await BlogPost.countDocuments(); // Общее количество записей блога
        const totalPages = Math.ceil(totalPosts / perPage); // Общее количество страниц

        const blogPosts: IBlogPost[] = await BlogPost.find()
            .skip((page - 1) * perPage) // Пропускаем записи на предыдущих страницах
            .limit(perPage) // Ограничиваем количество записей на текущей странице
            .populate('author', 'username');

        res.json({ blogPosts, currentPage: page, totalPages });
    } catch (error) {
        console.error('Error retrieving blog posts:', error);
        res.status(500).json({ message: 'Error retrieving blog posts' });
    }
};

export const getBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Retrieve a specific blog post by ID
        const blogPost: IBlogPost | null = await BlogPost.findById(id).populate('author', 'username');
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.json(blogPost);
    } catch (error) {
        console.error('Error retrieving blog post:', error);
        res.status(500).json({ message: 'Error retrieving blog post' });
    }
};

export const updateBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const author = req['user'].userId; // Get the user ID from the authenticated user

        // Find the blog post by ID
        const blogPost: IBlogPost | null = await BlogPost.findById(id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if the authenticated user is the author of the blog post
        if (blogPost.author.toString() !== author) {
            return res.status(403).json({ message: 'You are not authorized to update this blog post' });
        }

        // Update the blog post
        blogPost.message = message;
        await blogPost.save();

        res.json({ message: 'Blog post updated successfully' });
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ message: 'Error updating blog post' });
    }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const author = req['user'].userId; // Get the user ID from the authenticated user

        // Find the blog post by ID
        const blogPost: IBlogPost | null = await BlogPost.findById(id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if the authenticated user is the author of the blog post
        if (blogPost.author.toString() !== author) {
            return res.status(403).json({ message: 'You are not authorized to delete this blog post' });
        }

        // Delete the blog post
        await blogPost.remove();

        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Error deleting blog post' });
    }
};