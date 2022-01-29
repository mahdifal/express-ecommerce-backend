const { Product } = require("../models/productModel");
const { Category } = require("../models/categoryModel");
const Joi = require("joi");
const mongoose = require("mongoose");
const pagination = require("../services/paginationService");

exports.productsList = async (req, res, next) => {
  try {
    let projection = {};
    if (req?.query?.hasOwnProperty("fields")) {
      projection = req?.query?.fields?.split(",").reduce((total, current) => {
        return { [current]: 1, ...total };
      }, {});
    }

    let filter = [];
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }

    const apiName = "products";
    const limit = process.env.PER_PAGE;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    const productCount = await Product.count();
    const totalPages = Math.ceil(productCount / limit);

    const productList = await Product.find({ filter }, projection)
      .select("-__v")
      .populate("category")
      .limit(limit)
      .skip(offset);

    if (!productList) return res.status(500).json({ success: false });

    return res.send({
      success: true,
      message: "List of products fetched successfully.",
      data: {
        productList,
      },
      meta: pagination({ totalPages, page, apiName, limit }),
    });
  } catch (error) {
    next(error);
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "The product id was not found." });
    }

    const product = await Product.findById(id).populate("category");

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "The product was not found!" });

    return res.send(product);
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required().min(2),
      description: Joi.string().min(3).max(200).required(),
      detailProduct: Joi.string().min(3).max(200),
      image: Joi.string().min(3).max(200).required(),
      images: Joi.string().min(3).max(200),
      brand: Joi.string().min(2).max(200),
      price: Joi.number().min(1),
      category: Joi.string().min(3).max(200),
      countInStock: Joi.number().min(1),
      rating: Joi.number().min(1),
      numReviews: Joi.number().min(1),
      isFeatured: Joi.boolean(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(404).send("Invalid category");

    const filename = req.file.filename;
    // const pathFilename = `${process.env.APP_URL}/public/uploads/${filename}`;

    const {
      name,
      description,
      detailProduct,
      images,
      brand,
      price,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    let product = new Product({
      name,
      description,
      detailProduct,
      image: filename,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    });

    product = await product.save();

    if (!product) return res.status(500).send("The product cannot be created.");

    return res.status(201).send(product);
  } catch (error) {
    next(error);
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "The product id was not found." });
    }

    const product = await Product.findByIdAndRemove(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "The product was not found." });
    }

    return res.send({ success: true, message: "The product is deleted." });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "The product id was not found." });
    }

    const schema = Joi.object({
      name: Joi.string().required().min(2),
      description: Joi.string().min(3).max(200).required(),
      detailProduct: Joi.string().min(3).max(200),
      image: Joi.string().min(3).max(200),
      images: Joi.string().min(3).max(200),
      brand: Joi.string().min(2).max(200),
      price: Joi.number().min(1),
      category: Joi.string().min(3).max(200),
      countInStock: Joi.number().min(1),
      rating: Joi.number().min(1),
      numReviews: Joi.number().min(1),
      isFeatured: Joi.boolean(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(404).send("Invalid category");

    const {
      name,
      description,
      detailProduct,
      image,
      images,
      brand,
      price,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        detailProduct,
        image,
        images,
        brand,
        price,
        category,
        countInStock,
        rating,
        numReviews,
        isFeatured,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("The product cannot be updated.");

    return res.send(product);
  } catch (error) {
    next(error);
  }
};

exports.getProductCount = async (req, res, next) => {
  try {
    const productCount = await Product.countDocuments({});

    if (!productCount) return res.status(500).json({ success: false });

    return res.send({ productCount });
  } catch (error) {
    next(error);
  }
};

exports.addGalleryImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "The product id was not found." });
    }

    const files = req.files;
    let imagesPaths = [];
    // const basePath = `${process.env.APP_URL}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(file.filename);
      });
    }

    const productImages = await Product.findByIdAndUpdate(
      id,
      { images: imagesPaths },
      { new: true }
    );

    if (!productImages)
      return res.status(500).send("The Product Images cannot be updated.");

    return res.send(productImages);
  } catch (error) {
    next(error);
  }
};
