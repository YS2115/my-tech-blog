

const categoryList = require('../utils/categoryList');

exports.paginatePosts = (posts, page = 1, limit = 3) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(posts.length / limit);
    return {
      paginatedPosts: paginatedPosts,
      totalPages: totalPages,
    };
  }
  
exports.buildPaginationUrl = (currentPage, page, query, category) => {
    category = Object.keys(categoryList).find(key => categoryList[key] === category);
    if (currentPage === 'home') {
        return `/page/${page}`;
    } else if (currentPage === 'category') {
        return `/category/${category}/page/${page}`;
    } else if (currentPage === 'search') {
        return `/search/page/${page}?q=${encodeURIComponent(query)}`;
    }
}
