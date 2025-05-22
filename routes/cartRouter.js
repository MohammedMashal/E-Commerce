const express = require("express");

const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");
const cartValidator = require("../utils/validators/cartValidator");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("user"));

router
	.route("/")
	.post(
		cartValidator.addProductToCartVAlidator,
		cartController.addProductToCart
	)
	.get(cartController.getLoggedUserCart)
	.delete(cartController.clearCart);

router.patch(
	"/applyCoupon",
	cartValidator.applyCouponValidator,
	cartController.applyCoupon
);

router
	.route("/:id")
	.patch(
		cartValidator.updateCartItemQuantityValidator,
		cartController.updateCartItemQuantity
	)
	.delete(
		cartValidator.removeSpecificCartItemValidator,
		cartController.removeSpecificCartItem
	);

module.exports = router;
