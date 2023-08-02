const router = require('express').Router()
const userController = require("../controller/User/userController")

// Register route.
router.post('/register', userController.Register);

// Login user
router.post('/login', userController.Login);

// Logout user
router.post('/logout', userController.Logout);


module.exports = router
