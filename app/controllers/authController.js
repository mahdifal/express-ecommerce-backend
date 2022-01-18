const UserModel = require("../models/userModel");
const TokenService = require("../services/tokenService");

exports.login = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "Username or password is wrong!",
      });
    }

    const token = TokenService.sign({ id: user._id });
    return res.send({
      status: "success",
      code: 200,
      token,
    });
  } catch (error) {
    next(error);
  }
};
