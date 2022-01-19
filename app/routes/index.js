const userRouter = require("./users");
const authRouter = require("./auth");
const catRouter = require("./category");
const productRouter = require("./product");

module.exports = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", catRouter);
  app.use("/api/v1/products", productRouter);
};
