const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", [auth, admin], productController.productsList);
router.post(
  "/",
  [auth, admin, upload.single("image")],
  productController.addProduct
);
router.delete("/:id", [auth, admin], productController.removeProduct);
router.get("/:id", [auth], productController.getOneProduct);
router.put("/:id", [auth, admin], productController.updateProduct);
router.put(
  "/gallery-images/:id",
  [auth, admin, upload.array("images", 10)],
  productController.addGalleryImages
);
router.get("/get/count", [auth, admin], productController.getProductCount);

module.exports = router;
