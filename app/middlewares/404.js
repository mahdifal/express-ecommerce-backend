module.exports = (app) => {
  app.use((req, res) => {
    res.status(404).send({
      code: "Not Found!",
      status: 404,
      message: "Requested resource could not be found",
    });
  });
};
