const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.productsList);
router.post("/", productController.addProduct);
router.delete("/:id", productController.removeProduct);
router.get("/:id", productController.getOneProduct);
router.patch("/:id", productController.updateProduct);

module.exports = router;
