const express = require('express');

const router= express.Router();
const protectRoute = require('../middleware/protectRoute');
const {createPost, deletePost} = require('../controller/post.controller');


router.post('/create', protectRoute, createPost);
router.delete('/:id', protectRoute, deletePost);

module.exports= router;