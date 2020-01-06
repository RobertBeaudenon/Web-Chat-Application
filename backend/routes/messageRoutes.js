const express = require('express');

const router = express.Router();

const messageCtrl = require('../controllers/message');
const AuthHelper = require('../Helpers/authHelper');

router.post('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.VerifyToken, messageCtrl.SendMessage);

module.exports = router;
