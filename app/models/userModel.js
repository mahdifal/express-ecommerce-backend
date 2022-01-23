const mongoose = require("mongoose");
const { sign } = require("../services/tokenService");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  postcode: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

userSchema.methods.generateAuthToken = function () {
  const token = sign({ _id: this._id, isAdmin: this.isAdmin });
  return token;
};

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
