const express = require('express');
const router = express.Router();
const {signUp, logOut, logIn, getMe} = require('../controller/auth.controller');
const protectRoute = require('../middleware/protectRoute');

router.get('/me',protectRoute, getMe);

router.post('/signUp', signUp);

router.post('/logIn', logIn);

router.post('/logOut', logOut);

module.exports= router;