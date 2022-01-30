const { User } = require("../models/userModel");
const mongoose = require("mongoose");
const pagination = require("../services/paginationService");

exports.usersList = async (req, res, next) => {
  try {
    let projection = {};
    if (req?.query?.hasOwnProperty("fields")) {
      projection = req?.query?.fields?.split(",").reduce((total, current) => {
        return { [current]: 1, ...total };
      }, {});
    }

    const apiName = "users";
    const limit = process.env.PER_PAGE;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    const usersCount = await User.count();
    const totalPages = Math.ceil(usersCount / limit);

    const userList = await User.find({}, projection)
      .select("-password")
      .limit(limit)
      .skip(offset);

    if (!userList) return res.status(500).json({ success: false });

    return res.send({
      success: true,
      message: "List of users fetched successfully.",
      data: {
        userList,
      },
      meta: pagination({ totalPages, page, apiName, limit }),
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "The user id was not found." });
    }

    const user = await User.findById(id).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "The user was not found!" });

    return res.send(user);
  } catch (error) {
    next(error);
  }
};
