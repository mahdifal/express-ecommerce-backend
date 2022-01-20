const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.productsList);
router.post("/", productController.addProduct);
router.delete("/:id", productController.removeProduct);
router.get("/:id", productController.getOneProduct);
router.put("/:id", productController.updateProduct);
router.get("/get/count", productController.getProductCount);

module.exports = router;
