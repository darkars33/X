const express= require('express');
const router = express.Router();
const protectRoute= require('./../middleware/protectRoute');
const {getUserProfile, followUnfollowUser, getSuggestedUsers, getUserUpdate} = require('./../controller/user.controller');

router.get('/profile/:username', protectRoute, getUserProfile);

router.post('/follow/:id', protectRoute, followUnfollowUser);

router.get('/suggestedUsers', protectRoute, getSuggestedUsers);

router.post('/update', protectRoute, getUserUpdate);

module.exports= router;