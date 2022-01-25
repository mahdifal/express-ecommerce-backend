const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", [auth, admin], orderController.ordersList);
router.get("/:id", orderController.getOrder);
router.post("/", orderController.addOrder);
router.delete("/:id", orderController.removeOrder);
router.put("/:id", orderController.updateOrder);
router.get("/userorders/:userid", orderController.getUserOrders);
router.get("/ordercount", orderController.orderCount);
router.get("/totalprice", orderController.getTotalPrice);

module.exports = router;
