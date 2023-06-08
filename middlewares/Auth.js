const jwt = require("jsonwebtoken");
const config = require('./../config')

const verifyTheToken = (req, res, next) => {
  // getting the token from the header
  const bearer = req.headers["authorization"];
  if (bearer) {
    const bearerToken = bearer.split(" ");
    const token = bearerToken[1];
    jwt.verify(
      bearer,
      config.jwt_secret,
      (err, data) => {
        if (err) {
          if (err.message=="jwt expired"){
            res.status(400).json({
              error: true,
              message: "Your sessions has expired. Please login again.",
            });
            return
          }
          res.status(400).json({
            error: true,
            message: "your token is invalid",
          });
          return
        } else {
          req.userData = data;
          next();
        }
      }
    );
  } else {
    res.status(400).json({
      error: true,
      message: "your token is invalid",
    });
    return
  }
};

module.exports = verifyTheToken;
