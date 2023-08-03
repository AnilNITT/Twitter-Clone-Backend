const router = require('express').Router()
const tweetController = require("../controller/Tweet/tweetController")
const {authenticateToken} = require("../middleware/Auth")
// Register route.
router.post('/add-tweet', authenticateToken,tweetController.addTweet);


// Login user tweets
router.get('/get-tweets', authenticateToken,tweetController.GetUserTweet);

// get Tweet Feed
router.get('/getAll', authenticateToken, tweetController.GetAllTweet);

// get Single tweet
router.get('/get/:tweetId', authenticateToken, tweetController.GetSingleTweet);


// update the tweet
router.patch('/update-tweet', authenticateToken, tweetController.updateTweet);


// update the tweet
router.delete('/delete-tweet', authenticateToken, tweetController.deleteTweet);

module.exports = router
