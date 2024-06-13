const express = require('express');
const router = express.Router();
const {signUp, logOut, logIn} = require('../controller/auth.controller');

router.post('/signUp', signUp);

router.post('/logIn', logIn);

router.post('/logOut', logOut);

module.exports= router;