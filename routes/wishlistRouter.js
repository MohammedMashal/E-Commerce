const express = require("express");

const wishlistController = require("../controllers/wishlistController");
const authController = require("../controllers/authController");
const wishlistValidator = require("../utils/validators/wishlistValidator");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("user"));

router
	.route("/")
	.post(
		wishlistValidator.addProductToWishlistValidator,
		wishlistController.addProductToWishlist
	)
	.get(wishlistController.getWishlist);

router
	.route("/:id")
	.delete(
		wishlistValidator.removeProductFromWishlistValidator,
		wishlistController.removeProductFromWishlist
	);

module.exports = router;
