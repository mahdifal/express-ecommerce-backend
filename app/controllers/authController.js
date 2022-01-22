const { User } = require("../models/userModel");
const Joi = require("joi");
const { hash, compare } = require("../services/hashService");
const { sign, verify } = require("../services/tokenService");

exports.login = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().min(5).max(50).required(),
      password: Joi.string().min(5).max(10).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("The user is not found!");
    }

    if (user && compare(password, user.password)) {
      const token = user.generateAuthToken();
      // return res.send({ user: user.email, token });
      return res.send(token);
    } else {
      return res.status(401).send("The user or password is wrong!");
    }
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().min(5).max(50).required(),
      password: Joi.string().min(5).max(10).required(),
      phone: Joi.number().min(9).required(),
      city: Joi.string().min(2),
      country: Joi.string().min(2),
      postCode: Joi.number().min(5),
      address: Joi.string().min(5).max(50),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password, phone, city, country, postCode, address } =
      req.body;
    const newUser = new User({
      name,
      email,
      password: hash(password),
      phone,
      city,
      country,
      postCode,
      address,
    });

    await newUser.save();
    res.status(201).send({
      success: true,
      message: "The user is created!",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};
