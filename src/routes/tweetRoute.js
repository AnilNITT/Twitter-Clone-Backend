const router = require('express').Router()
const tweetController = require("../controller/Tweet/tweetController")

// check for valid token Authentication
const {authenticateToken} = require("../middleware/Auth")


// Add new Tweet.
router.post('/add-tweet', authenticateToken,tweetController.addTweet);

// Login user All tweets
router.get('/get-tweets', authenticateToken,tweetController.GetUserTweet);

// get Tweet Feeds for Login user
router.get('/getAll', authenticateToken, tweetController.GetAllTweet);

// get Single tweet
router.get('/get/:tweetId', authenticateToken, tweetController.GetSingleTweet);

// update the tweet
router.patch('/update-tweet', authenticateToken, tweetController.updateTweet);

// delete the tweet
router.delete('/delete-tweet', authenticateToken, tweetController.deleteTweet);

module.exports = router
