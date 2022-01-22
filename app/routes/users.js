const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.usersList);
router.get("/:id", usersController.getUser);

module.exports = router;
