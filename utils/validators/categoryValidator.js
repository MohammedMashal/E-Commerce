const { check } = require("express-validator");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.createCategoryValidator = [
	check("name")
		.notEmpty()
		.withMessage("Category name can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Too short Category name")
		.bail()
		.isLength({ max: 32 })
		.withMessage("Too long Category name"),
	validatorController,
];

exports.getCategoryValidator = [checkId("Category"), validatorController];

exports.updateCategoryValidator = [
	checkId("Category"),
	check("name")
		.optional()
		.notEmpty()
		.withMessage("Category name can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Too short Category name")
		.bail()
		.isLength({ max: 32 })
		.withMessage("Too long Category name"),
	validatorController,
];

exports.deleteCategoryValidator = [checkId("Category"), validatorController];
