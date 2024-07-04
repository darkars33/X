const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { getNotification, deleteNotification } = require('../controller/notification.controller');

const router = express.Router();

router.get('/', protectRoute, getNotification);
router.delete('/', protectRoute, deleteNotification);

module.exports= router;