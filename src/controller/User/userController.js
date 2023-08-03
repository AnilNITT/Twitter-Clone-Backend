const User = require("../../models/User/User");
const { StatusCodes } = require("http-status-codes");
const Encrypt = require("../../helper/encrypt");
const { generateUserToken } = require("../../middleware/Auth");

// User Registration
exports.Register = async (req, res) => {
  try {
    // take input from User
    const { email, password } = req.body;

    // verify valid input data
    if (email === undefined || password === undefined || email === "") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "email and password is required",
      });
    }

    // check if User is already registered
    let data = await User.findOne({ email: email });

    if (data) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "Email already exits",
      });
    }

    const userData = {
      name: req.body.name,
      email: email,
      password: Encrypt.hashPassword(password),
    };

    // create a new user
    let user = await User.create(userData);

    // generate JWT Token
    const token = generateUserToken(user._id, user.email);

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Registration Successfull",
      data: user,
      token: token,
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

// User Registration
exports.Login = async (req, res) => {
  try {
    // take input from User
    const { email, password } = req.body;

    // verify valid input data
    if (email === undefined || password === undefined || email === "") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "email and password is required",
      });
    }

    // Check USer data into Database
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "User Not Found",
      });
    }

    // compare input password with User.password
    const matchPass = Encrypt.comparePassword(user.password, password);

    //if Password is Match
    if (matchPass === true) {
      // generate token
      const token = generateUserToken(user._id, user.email);

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Login Successfull",
        data: user,
        token: token,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "Email or Password is incorrect",
      });
      return;
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

// User logout
exports.Logout = async (req, res) => {
  try {
    res
      .status(StatusCodes.OK)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "User logout successfully",
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

// Follow User
exports.Following = async (req, res) => {
  try {
    // get user details from verified token
    const user = req.user;

    // take Following user data as input
    const { followId } = req.body;

    // Can't Follow urself
    if (user.user_id == followId) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "U can not Follow urself",
      });
      return;
    }

    // check login user Data
    const userData = await User.findById(user.user_id);
    // checking Following user data
    const followuserData = await User.findById(followId);

    // check if followId user already we are following
    if (!userData.following.includes(followId)) {
      // Add followId user into our Following List
      userData.following.push(followId);

      // add login user to FollowId user Follower List
      followuserData.followers.push(userData._id);

      // save user data after updating Following n follower list
      await userData.save();
      await followuserData.save();

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Following Successfully",
        data: userData,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "You Already follow this user",
      });
      return;
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

// Unfollow User
exports.UnFollowing = async (req, res) => {
  try {
    // get user details from verified token
    const user = req.user;

    // take Following user data as input
    const { unfollowId } = req.body;

    // get login user data
    const userData = await User.findById(user.user_id);

    // get unfollowing user data
    const followuserData = await User.findById(unfollowId);

    if (userData.following.includes(unfollowId)) {
      // remove unfollowId user from our Following List
      userData.following.splice([userData.following.indexOf(unfollowId)], 1);

      // remove login user from FollowId user Follower List
      followuserData.followers.splice(
        [followuserData.followers.indexOf(user.user_id)],
        1
      );

      // save user data after updating Following n follower list
      await userData.save();
      await followuserData.save();

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Unfollowing Successfully",
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "User is not in your following list",
      });
      return;
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
