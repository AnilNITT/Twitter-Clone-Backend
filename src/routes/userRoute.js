const router = require('express').Router()
const userController = require("../controller/User/userController")

// check for valid token Authentication
const {authenticateToken} = require("../middleware/Auth")


// Register user.
router.post('/register', userController.Register);

// Login user
router.post('/login', userController.Login);

// Logout user
router.post('/logout', authenticateToken, userController.Logout);

// follow the User
router.patch('/follow', authenticateToken, userController.Following);

// unfollow the User
router.patch('/unfollow', authenticateToken, userController.UnFollowing);

module.exports = router
