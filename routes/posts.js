const express = require('express');

const PostsController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');
const extactFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, extactFile, PostsController.createPost);

router.put('/:id', checkAuth, extactFile, PostsController.updatePost);

router.get('', PostsController.getPosts);

router.get('/:id',  PostsController.getPost);

router.delete('/:id', checkAuth, PostsController.removePost);

module.exports = router;