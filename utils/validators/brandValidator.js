const { check } = require("express-validator");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.createBrandValidator = [
	check("name")
		.notEmpty()
		.withMessage("Brand name can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Too short Brand name")
		.bail()
		.isLength({ max: 32 })
		.withMessage("Too long Brand name"),
	validatorController,
];

exports.getBrandValidator = [checkId("Brand"), validatorController];

exports.updateBrandValidator = [
	checkId("Brand"),
	check("name")
		.optional()
		.notEmpty()
		.withMessage("Brand name can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Too short Brand name")
		.bail()
		.isLength({ max: 32 })
		.withMessage("Too long Brand name"),
	validatorController,
];

exports.deleteBrandValidator = [checkId("Brand"), validatorController];
