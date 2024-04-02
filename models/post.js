// models/post.js
const fs = require('fs');
const path = require('path');
const postsDirectory = path.join(__dirname, '..', 'posts');

class Post {
static async getAllPosts() {
    const files = await fs.promises.readdir(postsDirectory);
    const posts = await Promise.all(files
      .filter((file) => path.extname(file) === '.md')
      .map(async (file) => {
        const fileContent = await fs.promises.readFile(path.join(postsDirectory, file), 'utf8');
        const splitIndex = fileContent.indexOf('---\n', 4);
        const metaData = fileContent.substring(0, splitIndex).trim();
        const content = fileContent.substring(splitIndex + 4).trim();
        const meta = metaData.split('\n').reduce((acc, line) => {
          const [key, value] = line.split(': ');
          acc[key.trim()] = value.trim();
          return acc;
        }, {});
        return {
          slug: file.slice(0, -3),
          ...meta,
          tags: meta.tags.split(', '),
          formattedDate: new Date(meta.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
          content,
        };
      }));
    return posts;
  }

  static async getPostBySlug(slug) {
    const posts = await Post.getAllPosts();
    return posts.find((post) => post.slug === slug);
  }

  static async getFeaturedPosts() {
    const posts = await Post.getAllPosts();
    return posts.slice(0, 4);
  }

  // 他のメソッドも追加していく
  
}

module.exports = Post;
