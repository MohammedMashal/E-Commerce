const { check } = require("express-validator");

const AppError = require("../appError");
const Category = require("../../models/categoryModel");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.createSubCategoryValidator = [
	check("name")
		.notEmpty()
		.withMessage("SubCategory name can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Too short SubCategory name")
		.bail()
		.isLength({ max: 32 })
		.withMessage("Too long SubCategory name"),
	check("category")
		.notEmpty()
		.withMessage("SubCategory must belong to Category")
		.bail()
		.isMongoId()
		.withMessage("Invalid Category ID")
		.bail()
		.custom(async (categoryId) => {
			const category = await Category.findById(categoryId);
			if (!category) {
				throw new AppError("No Category with this ID", 400);
			}
			return true;
		}),
	validatorController,
];

exports.getSubCategoryValidator = [checkId("SubCategory"), validatorController];

exports.getSubCategoriesValidator = [
	check("categoryId").optional().isMongoId().withMessage("Invalid Category ID"),
	validatorController,
];

exports.updateSubCategoryValidator = [
	checkId("SubCategory"),
	check("name")
		.optional()
		.notEmpty()
		.withMessage("SubCategory name can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Too short SubCategory name")
		.bail()
		.isLength({ max: 32 })
		.withMessage("Too long SubCategory name")
		.bail(),
	check("category")
		.optional()
		.notEmpty()
		.withMessage("category field can't be empty")
		.bail()
		.isMongoId()
		.withMessage("Invalid Category Id")
		.bail()
		.custom(async (categoryId) => {
			const category = await Category.findById(categoryId);
			if (!category) {
				throw new AppError("No Category with this ID", 400);
			}
		}),
	validatorController,
];

exports.deleteSubCategoryValidator = [
	checkId("SubCategory"),
	validatorController,
];
