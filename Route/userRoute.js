const express = require('express');

const userController = require('../Controller/userController');

const router = express.Router();

// login route
router.post('/login', userController.loginUser);

// signup route
router.post('/signup', userController.signupUser);


module.exports = router;
