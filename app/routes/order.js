const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", [auth, admin], orderController.ordersList);
router.get("/:id", [auth], orderController.getOrder);
router.post("/", [auth], orderController.addOrder);
router.delete("/:id", [auth, admin], orderController.removeOrder);
router.put("/:id", [auth, admin], orderController.updateOrder);
router.get("/userorders/:userid", [auth, admin], orderController.getUserOrders);
router.get("/ordercount", [auth, admin], orderController.orderCount);
router.get("/totalprice", [auth, admin], orderController.getTotalPrice);

module.exports = router;
