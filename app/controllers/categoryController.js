const { Category } = require("../models/categoryModel");
const Joi = require("joi");
const pagination = require("../services/paginationService");

exports.categoriesList = async (req, res, next) => {
  try {
    let projection = {};
    if (req?.query?.hasOwnProperty("fields")) {
      projection = req?.query?.fields?.split(",").reduce((total, current) => {
        return { [current]: 1, ...total };
      }, {});
    }

    const apiName = "categories";
    const limit = process.env.PER_PAGE;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    const categoriesCount = await Category.count();
    const totalPages = Math.ceil(categoriesCount / limit);

    const categoryList = await Category.find({}, projection)
      .limit(limit)
      .skip(offset);

    if (!categoryList) return res.status(500).json({ success: false });

    return res.send({
      success: true,
      message: "List of categories fetched successfully.",
      data: {
        categoryList,
      },
      meta: pagination({ totalPages, page, apiName, limit }),
    });
  } catch (error) {
    next(error);
  }
};

exports.getOneCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .send({ success: false, message: "The category was not found!" });
    }

    return res.send(category);
  } catch (error) {
    next(error);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      icon: Joi.string().min(3).max(200).required(),
      color: Joi.string().min(3).max(200),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, icon, color } = req.body;

    let category = new Category({ name, icon, color });
    category = await category.save();

    if (!category)
      return res.status(500).send("The category cannot be created.");

    return res.status(201).send(category);
  } catch (error) {
    next(error);
  }
};

exports.removeCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndRemove(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "The category was not found." });
    }

    return res.send({ success: true, message: "The category is deleted." });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon, color } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        icon,
        color,
      },
      { new: true }
    );

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "The category was not found." });
    }

    return res.send(category);
  } catch (error) {
    next(error);
  }
};
