const usersList = (req, res, next) => {
  res.send({
    success: true,
    message: "user list is created successfully.",
  });
};

module.exports = {
  usersList,
};
