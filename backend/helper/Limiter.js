const rateLimit = require("express-rate-limit");

/*               api-auth               */
const limiterForLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 5,
  handler: (req, res, next) => {
    res.status(400).json({
      message: "Too many requests, please try again after 15 minutes",
    });
  },
});

module.exports = {limiterForLogin};