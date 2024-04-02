// controllers/errorController.js
const Post = require('../models/post');

exports.get404 = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  };
  
exports.handleErrors = async (err, req, res, next) => {
    res.status(err.status || 500);
    console.error(err);
    res.render('error', {
      message: err.message,
      error: err,
      featuredPosts: await Post.getFeaturedPosts(),
      currentPage: 'error',
      category: 'ページが見つかりません',
    });
  };
