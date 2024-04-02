const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getIndexPage);
router.get('/page/:page', postController.getIndexPage);
router.get('/category/:category', postController.getCategoryPage);
router.get('/category/:category/page/:page', postController.getCategoryPage);
router.get('/tag/:tag', postController.getTagPage);
router.get('/tag/:tag/:page', postController.getTagPage);
router.get('/search', postController.getSearchPage); 
router.get('/search/page/:page', postController.getSearchPage);
router.get('/posts/:slug', postController.getPostPage);

module.exports = router;
