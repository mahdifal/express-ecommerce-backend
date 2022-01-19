const { Category } = require("../models/categoryModel");
const Joi = require("joi");

exports.categoriesList = async (req, res, next) => {
  try {
    const categoryList = await Category.find();

    if (!categoryList) return res.status(500).json({ success: false });

    return res.send({
      success: true,
      message: "List of categories fetched successfully.",
      data: {
        categoryList,
      },
      //   meta: pagination({ totalPages, page, apiName, limit }),
    });
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

exports.removeCategory = (req, res, next) => {
  try {
    const { id } = req.params;

    Category.findByIdAndRemove(id).then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "The category is deleted." });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The category was not found." });
      }
    });
  } catch (error) {
    next(error);
  }
};
