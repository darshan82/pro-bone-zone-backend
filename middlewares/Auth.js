const jwt = require("jsonwebtoken");
const config = require("./../config");

exports.verifyTheToken = (req, res, next) =>
{
  const bearer = req.headers["authorization"];
  if (!bearer)
  {
    return res.status(400).json({
      error: true,
      message: "No token provided",
    });
  }
  const token = bearer

  jwt.verify(token, config.jwt_secret, (err, data) =>
  {
    if (err)
    {
      console.log(err)
      if (err.name === "TokenExpiredError")
      {
        return res.status(400).json({
          error: true,
          message: "Your session has expired. Please login again.",
        });
      }

      return res.status(400).json({
        error: true,
        message: "Invalid token",
      });
    }

    req.userData = data;
    next();
  });
};

