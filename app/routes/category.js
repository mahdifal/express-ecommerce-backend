const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.categoriesList);
router.post("/", categoryController.addCategory);
router.delete("/:id", categoryController.removeCategory);
router.get("/:id", categoryController.getOneCategory);
router.patch("/:id", categoryController.updateCategory);

module.exports = router;
