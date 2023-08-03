const jwt = require("jsonwebtoken");

exports.generateUserToken = (id, email) => {
  try {
    const token = jwt.sign(
      {
        email,
        user_id: id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "2d" }
    );

    return token;

  } catch (e) {
    return e.message;
  }
};


exports.authenticateToken = (req, res, next) => {
  
  const token = req.headers["authorization"];

  if (token == null || token === "") {
    return res.status(401).send({
      status: false,
      message: "Token is required",
    });
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(401).send({
          status: false,
          error: "Invalid Token",
        });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).send({
      status: false,
      error: err.message,
    });
  }
};
