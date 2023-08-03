const User = require("../../models/User");
const { StatusCodes } = require("http-status-codes");
const Encrypt = require("../../helper/encrypt");
const { generateUserToken } = require("../../middleware/Auth");

// User Registration
exports.Register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === undefined || password === undefined || email === "") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "email and password is required",
      });
    }

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
    const { email, password } = req.body;

    if (email === undefined || password === undefined || email === "") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "email and password is required",
      });
    }

    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "User Not Found",
      });
    }

    // compare password
    const matchPass = Encrypt.comparePassword(user.password, password);

    if (matchPass === true) {
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

    const { followId } = req.body;

    // Can't Follow urself
    if (user.user_id == followId) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "U can not Follow urself",
      });
      return;
    }

    const userData = await User.findById(user.user_id);
    const followuserData = await User.findById(followId);

    if (!userData.following.includes(followId)) {
      userData.following.push(followId);
      followuserData.followers.push(userData._id);

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

    const { unfollowId } = req.body;

    // get login user data
    const userData = await User.findById(user.user_id);
    // get unfollowing user data
    const followuserData = await User.findById(unfollowId);

    if (userData.following.includes(unfollowId)) {

      // remove user from following n followers list
      userData.following.splice([userData.following.indexOf(unfollowId)],1)
      followuserData.followers.splice([followuserData.followers.indexOf(user.user_id)],1)
      
      // save user after updating list
      await userData.save();
      await followuserData.save();

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Unfollowing Successfully",
      });
    } 
    else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: "User is not in your following list",
      });
      return;
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Following Successfully",
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