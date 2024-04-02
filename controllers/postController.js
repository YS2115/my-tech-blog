// controllers/postController.js

const Post = require('../models/post');
const { Marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const hljs = require('highlight.js');
const categoryList = require('../utils/categoryList');
const { paginatePosts, buildPaginationUrl } = require('../utils/helpers');

const marked = new Marked(
    markedHighlight({
      highlight(code, lang, info) {
        const validLanguage = hljs.getLanguage(lang) ? lang : 'plaintext';
        return `<div class="hljs" data-lang="${validLanguage}">${hljs.highlightAuto(code).value}</div>`;
      },
      langPrefix: '', 
    })
  );

exports.getIndexPage = async (req, res) => {
  const page = req.params.page || 1;
  const [posts, featuredPosts] = await Promise.all([
      Post.getAllPosts(),
      Post.getFeaturedPosts()
  ]);
  const {paginatedPosts, totalPages} = paginatePosts(posts, page);
  res.render('index', {
    posts: paginatedPosts,
    featuredPosts: featuredPosts,
    currentPage: 'home',
    category: 'ホーム',
    page: page,
    totalPages: totalPages,
    buildPaginationUrl: buildPaginationUrl,
    query: '',
  });  
};

exports.getCategoryPage = async (req, res) => {
    const page = req.params.page || 1;
    const category = req.params.category;
    const [posts, featuredPosts] = await Promise.all([
        Post.getAllPosts(),
        Post.getFeaturedPosts()
    ]);
    const filteredPosts = posts.filter((post) => post.category === category);
    const {paginatedPosts, totalPages} = paginatePosts(filteredPosts, page);
    res.render('index', {
      posts: paginatedPosts,
      featuredPosts: featuredPosts,
      currentPage: 'category',
      category: categoryList[req.params.category],
      page: page,
      totalPages: totalPages,
      buildPaginationUrl: buildPaginationUrl,
      query: '',
    });
};

exports.getTagPage = async (req, res) => {
    const page = req.params.page || 1;
    const tag = req.params.tag;
    const [posts, featuredPosts] = await Promise.all([
        Post.getAllPosts(),
        Post.getFeaturedPosts()
    ]);
    const filteredPosts = posts.filter((post) => post.tags.includes(tag));
    const {paginatedPosts, totalPages} = paginatePosts(filteredPosts, page);
    res.render('index', {
      posts: paginatedPosts,
      featuredPosts: featuredPosts,
      currentPage: 'tag',
      category: `タグ「${tag}」`,
      page: page,
      totalPages: totalPages,
      buildPaginationUrl: buildPaginationUrl,
      query: '',
    });
};


exports.getSearchPage = async (req, res) => {
    const page = req.params.page || 1;
    const query = req.query.q;
    const [posts, featuredPosts] = await Promise.all([
        Post.getAllPosts(),
        Post.getFeaturedPosts()
    ]);
    if (!query) {
      return res.render('index', {
        posts: [],
        featuredPosts: featuredPosts,
        currentPage: 'search',
        category: '検索結果',
        page: 1,
        totalPages: 0,
        buildPaginationUrl: buildPaginationUrl,
        query: '',
      });
    }
    const searchResults = posts.filter((post) => {
      return post.title.includes(query) ||
             post.excerpt.includes(query) ||
             post.tags.some(tag => tag.includes(query));
    });
    const {paginatedPosts, totalPages} = paginatePosts(searchResults, page);
    res.render('index', {
      posts: paginatedPosts,
      featuredPosts: featuredPosts,
      currentPage: 'search',
      category: `「${query}」で検索した結果`,
      page: page,
      totalPages: totalPages,
      buildPaginationUrl: buildPaginationUrl,
      query: query,
    });
  };

exports.getPostPage = async (req, res) => {
    const [post, featuredPosts] = await Promise.all([
        Post.getPostBySlug(req.params.slug),
        Post.getFeaturedPosts()
      ]);
    if (post) {
      const content = marked.parse(post.content);
      res.render('post', {
        post: { ...post, content },
        featuredPosts: featuredPosts,
        currentPage: 'post',
        category: categoryList[post.category],
      });
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        err.message = 'Not Found';
        res.render('error', {
        message: err.message,
        error: err,
        featuredPosts: featuredPosts,
        currentPage: 'error',
        category: 'ページが見つかりません',
      });
    }
  };
