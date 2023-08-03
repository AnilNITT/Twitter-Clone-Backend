const Tweet = require("../../models/Tweet/Tweet");
const { StatusCodes } = require("http-status-codes");
const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/User/User");

// Add Tweet
exports.addTweet = async (req, res) => {
  try {
    // get user details from verified token
    const user = req.user;

    // take tweet content from User
    const { content } = req.body;

    // verify valid input data
    if (content === undefined || content === "") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "Tweet content is required",
      });
    }

    const tweetData = {
      content: content,
      author: user.user_id,
    };

    // create a new tweet
    let tweet = await Tweet.create(tweetData);

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Tweet Added Successfully",
      data: tweet,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
    return;
  }
};

// Get Login User All Tweet
exports.GetUserTweet = async (req, res) => {
  try {
    // get user details from verified token
    const user = req.user;

    // match all tweets of login user Id
    const tweet = await Tweet.aggregate([
      {
        $match: { author: new ObjectId(user.user_id) },
      },
    ]);

    // if We will not found any tweets
    if (tweet.length == 0) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "No Tweet Found",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Successfull",
      data: tweet,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
    return;
  }
};

// Get Single Tweet
exports.GetSingleTweet = async (req, res) => {
  try {
    // get tweetId from API url Params
    const id = req.params.tweetId;

    // find tweet
    const tweet = await Tweet.findById(id);

    // if no tweet data found
    if (!tweet) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "No Tweet Found",
      });
    } else {
      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Successfull",
        data: tweet,
      });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
    return;
  }
};

// Update Tweet
exports.updateTweet = async (req, res) => {
  try {
    // get user details from verified token
    const user = req.user;

    // take update tweet content and tweetID from User
    const { tweetId, content } = req.body;

    // verify valid input data
    if (tweetId === undefined || tweetId === "") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "Tweet id is required",
      });
    }

    // find tweet to update
    const tweet = await Tweet.findById(tweetId);

    // if no tweet match with tweetId
    if (!tweet) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "No Tweet Found",
      });
    }

    // check user auth to update this task
    if (user.user_id !== tweet.author.toString()) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "You are not allowed to update this tweet",
      });
    }

    // update the tweet content
    const data = await Tweet.findByIdAndUpdate(
      { _id: tweetId },
      { content: content },
      { new: true }
    );

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Tweet Updated Successfull",
      data: data,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
    return;
  }
};

// Delete Tweet
exports.deleteTweet = async (req, res) => {
  try {
    // get user details from verified token
    const user = req.user;

    // take tweetID from User to delete
    const { tweetId } = req.body;

    // verify valid input data
    if (tweetId === undefined || tweetId === "") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "Tweet id is required",
      });
    }

    // find tweet to delete
    const tweet = await Tweet.findById(tweetId);

    // if no tweet match with tweetId
    if (!tweet) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "No Tweet Found",
      });
    }

    // check user auth to update this task
    if (user.user_id !== tweet.author.toString()) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "You are not allowed to Delete this tweet",
      });
    }

    // find and delete the tweet
    await Tweet.findByIdAndDelete(tweetId);

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Tweet deleted successfully",
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
    return;
  }
};

// get Tweet feeds
exports.GetAllTweet = async (req, res) => {
  try {
    // get user details from verified token
    const user = req.user;

    // get user following list
    const userData = await User.findById(user.user_id);

    // match Login user tweets and Following user tweets and sort by latest first
    const tweet = await Tweet.aggregate([
      {
        $match: {
          $or: [
            { author: { $in: userData.following } },
            { author: new ObjectId(user.user_id) },
          ],
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "author",
          foreignField: "_id",
          as: "Author",
        },
      },
      {
        $project: {
          content: 1, // 1 means show n 0 means not show
          author: 1,
          createdAt: 1,
          "Author.name": 1,
          "Author.email": 1,
        },
      },
    ]).sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Successfull",
      data: tweet,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "Something went wrong",
      error: err.message,
    });
    return;
  }
};
