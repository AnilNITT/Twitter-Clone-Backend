const router = require('express').Router()
const userController = require("../controller/User/userController")
const {authenticateToken} = require("../middleware/Auth")
// Register route.
router.post('/register', userController.Register);

// Login user
router.post('/login', userController.Login);

// Logout user
router.post('/logout', authenticateToken, userController.Logout);

router.patch('/follow', authenticateToken, userController.Following);

router.patch('/unfollow', authenticateToken, userController.UnFollowing);

module.exports = router
