const mongoose = require("mongoose");
const { MONGO_HOST, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB } =
  process.env;

mongoose.connection.on("error", (error) => {
  console.log(`mongodb connection failed!`, error.message);
});

const startMongoDB = () => {
  mongoose.connect(
    `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
  );
};

module.exports = startMongoDB;
