const express = require('express');

const userController = require('../Controller/userController');

const router = express.Router();

// login route
router.post('/login', userController.loginUser);

// signup route
router.post('/signup', userController.signupUser);

// logout Admin
router.get('/logoutAdmin', userController.logoutAdmin);
// logout Scolarite
router.get('/logoutScolarite', userController.logoutScolarite);
// logout Admin
router.get('/logoutDirection', userController.logoutDirection);
// verify if there are a user loggeIn Admin
router.get('/loggedInAdmin', userController.loggedInAdmin);
// verify if there are a user loggeIn Direction
router.get('/loggedInDirection', userController.loggedInDirection);
// verify if there are a user loggeIn scolarite
router.get('/loggedInScolarite', userController.loggedInScolarite);

module.exports = router;
