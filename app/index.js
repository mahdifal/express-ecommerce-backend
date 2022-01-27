const express = require("express");
const app = express();
const path = require("path");

require("./boot");
require("./middlewares")(app);
require("./routes")(app);
require("./middlewares/404")(app);
// app.use("/public/uploads", express.static(__dirname, "/public/uploads"));
// app.use(express.static(path.join(__dirname, "/public/uploads")));
// console.log(path.join(__dirname, "../public/uploads"));

module.exports = (port) => {
  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
};
