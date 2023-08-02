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

