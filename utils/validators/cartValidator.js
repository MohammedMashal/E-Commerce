const { check } = require("express-validator");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.addProductToCartVAlidator = [
	check("product").notEmpty().withMessage("Product field can't be empty"),
	check("color")
		.optional()
		.notEmpty()
		.withMessage("color field can't be empty"),
	check("quantity").optional(),
	validatorController,
];
exports.applyCouponValidator = [
	check("coupon").notEmpty().withMessage("coupon field can't be empty"),
	validatorController,
];
exports.updateCartItemQuantityValidator = [
	checkId("Cart Item"),
	check("quantity").notEmpty().withMessage("quantity field can't be empty"),
	validatorController,
];
exports.removeSpecificCartItemValidator = [
	checkId("Cart Item"),
	validatorController,
];
