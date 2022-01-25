const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// router.get("/", [auth, admin], usersController.usersList);
router.get("/", usersController.usersList);
router.get("/:id", usersController.getUser);

module.exports = router;
