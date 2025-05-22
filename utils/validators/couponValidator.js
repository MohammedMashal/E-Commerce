const { check } = require("express-validator");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.createCouponValidator = [
	check("name").notEmpty().withMessage("Coupon name can't be empty"),
	check("expire")
		.notEmpty()
		.withMessage("Coupon Expire date can't be empty")
		.bail()
		.isDate()
		.withMessage("Invalid Coupon date format"),
	check("discount")
		.notEmpty()
		.withMessage("Coupon discount value can't be empty")
		.bail()
		.isFloat()
		.withMessage("coupon discount value must be a number"),
	validatorController,
];
exports.updateCouponValidator = [
	check("name").optional().notEmpty().withMessage("Coupon name can't be empty"),
	check("expire")
		.optional()
		.notEmpty()
		.withMessage("Coupon Expire date can't be empty")
		.bail()
		.isDate()
		.withMessage("Invalid Coupon date format"),
	check("discount")
		.optional()
		.notEmpty()
		.withMessage("Coupon discount value can't be empty")
		.bail()
		.isFloat()
		.withMessage("coupon discount value must be a number"),
	validatorController,
];
exports.deleteCouponValidator = [checkId, validatorController];
