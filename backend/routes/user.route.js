const express= require('express');
const router = express.Router();
const protectRoute= require('./../middleware/protectRoute');
const {getUserProfile, followUnfollowUser} = require('./../controller/user.controller');

router.get('/profile/:username', protectRoute, getUserProfile);

router.post('/follow/:id', protectRoute, followUnfollowUser);

module.exports= router;