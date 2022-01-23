const TokenService = require("../services/tokenService");

module.exports = (req, res, next) => {
  const [, tokenValue] = req.headers.authorization.split(" ");
  const token = TokenService.decode(tokenValue);

  if (token.isAdmin === false) {
    return res.status(403).send({
      status: "error",
      code: 403,
      message: "Access denied.",
    });
  }

  next();
};
