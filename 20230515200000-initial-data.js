const BlogPost = require('../src/models/BlogPost');

exports.up = async function(db) {
    // Создаем стартовые записи блога
    const blogPosts = [
        { message: 'Первый пост', author: 'user1' },
        { message: 'Второй пост', author: 'user2' },
        { message: 'Третий пост', author: 'user3' },
    ];

    // Сохраняем записи блога в базе данных
    await BlogPost.insertMany(blogPosts);
};

exports.down = async function(db) {
    // Удаляем стартовые записи блога из базы данных
    await BlogPost.deleteMany({});
};

exports._meta = {
    "version": 1
};