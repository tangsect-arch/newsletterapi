const express = require('express');
const createUser = require('../controllers/user');
const newsLetter = require('../controllers/newsLetter');
const router = express.Router({ mergeParams: true });

router
  .route('/user')
  .post(createUser.user);


router
  .route('/newsLetter')
  .post(newsLetter.newsLetter);

module.exports = router;
