const express = require("express");

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.post(
	"/webhook-checkout",
	express.raw({ type: "application/json" }), // Needed for Stripe signature verification
	orderController.webhookCheckout
);

router.use(authController.protect);

router.post(
	"/webhook-checkout",
	express.raw({ type: "application/json" }), // Needed for Stripe signature verification
	orderController.webhookCheckout
);

router.get(
	"/checkout-session/:id",
	authController.restrictTo("user"),
	orderController.checkoutSession
);

router
	.route("/:id")
	.post(authController.restrictTo("user"), orderController.createCashOrder);

router.get(
	"/",
	orderController.filterOrderForLoggedUser,
	orderController.getAllOrders
);

router.get(
	"/:id",
	authController.restrictTo("admin"),
	orderController.getSpecificOrder
);

router.use(authController.restrictTo("admin"));

router.patch("/:id/pay", orderController.updateOrderToPaid);

router.patch("/:id/deliver", orderController.updateOrderToDelivered);

module.exports = router;
