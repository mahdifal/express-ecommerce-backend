const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", [auth, admin], categoryController.categoriesList);
router.post("/", [auth, admin], categoryController.addCategory);
router.delete("/:id", [auth, admin], categoryController.removeCategory);
router.get("/:id", [auth, admin], categoryController.getOneCategory);
router.patch("/:id", [auth, admin], categoryController.updateCategory);

module.exports = router;
