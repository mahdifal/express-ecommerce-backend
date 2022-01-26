const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");

router.get("/", productController.productsList);
router.post("/", upload.single("image"), productController.addProduct);
router.delete("/:id", productController.removeProduct);
router.get("/:id", productController.getOneProduct);
router.put("/:id", productController.updateProduct);
router.put(
  "/gallery-images/:id",
  upload.array("images", 10),
  productController.addGalleryImages
);
router.get("/get/count", productController.getProductCount);

module.exports = router;
