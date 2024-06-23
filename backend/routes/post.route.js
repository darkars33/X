const express = require('express');

const router= express.Router();
const protectRoute = require('../middleware/protectRoute');
const {createPost, deletePost, commentOnPost, likeOrUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts} = require('../controller/post.controller');

router.get('/allPosts', protectRoute, getAllPosts);
router.get('/likedPosts/:id', protectRoute, getLikedPosts);
router.get('/followings', protectRoute, getFollowingPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.post('/create', protectRoute, createPost);
router.delete('/:id', protectRoute, deletePost);
router.post('/comment/:id', protectRoute, commentOnPost);
router.post('/like/:id', protectRoute, likeOrUnlikePost);

module.exports= router;