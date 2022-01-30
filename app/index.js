const express = require("express");
const app = express();
const path = require("path");

require("./boot");
require("./middlewares")(app);
require("./routes")(app);
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);
require("./middlewares/404")(app);

module.exports = (port) => {
  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
};
