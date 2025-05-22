const { check } = require("express-validator");
const mongoose = require("mongoose");

const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

const AppError = require("../appError");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.createProductValidator = [
	check("title")
		.notEmpty()
		.withMessage("Product title can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Title must be at least 3 characters")
		.bail(),
	check("description")
		.notEmpty()
		.withMessage("Product description can't be empty")
		.bail()
		.isLength({ max: 2000 })
		.withMessage("Too long description"),
	check("quantity")
		.notEmpty()
		.withMessage("Product quantity can't be empty")
		.bail()
		.isNumeric()
		.withMessage("Product quantity must be a number"),
	check("sold")
		.optional()
		.notEmpty()
		.withMessage("Product sold number van't be empty")
		.bail()
		.isNumeric()
		.withMessage("Product sold must be a number"),
	check("price")
		.notEmpty()
		.withMessage("Product price can't be empty")
		.bail()
		.isNumeric()
		.withMessage("Product price must be a number")
		.bail()
		.isLength({ max: 32 })
		.withMessage("Too long product price"),
	check("priceAfterDiscount")
		.optional()
		.notEmpty()
		.withMessage("price after discount can't be empty")
		.bail()
		.isNumeric()
		.withMessage("price after discount must be a number")
		.bail()
		.custom((value, { req }) => {
			if (value >= req.body.price)
				throw new AppError("priceAfterDiscount must be lower than price");
			return true;
		}),
	check("colors")
		.optional()
		.isArray()
		.withMessage("available colors should be array of string"),
	check("imageCover")
		.notEmpty()
		.withMessage("Product image cover can't be empty"),
	check("images")
		.optional()
		.isArray()
		.withMessage("available images should be array of string"),
	check("category")
		.notEmpty()
		.withMessage("Product must belong to category")
		.bail()
		.isMongoId()
		.withMessage("Invalid category ID")
		.bail()
		.custom(async (categoryId) => {
			const category = await Category.findById(categoryId);
			if (!category) throw new AppError("There is no category with this id");
			return true;
		}),
	check("subCategory")
		.optional()
		.isArray({ min: 1 })
		.withMessage("SubCategories must be a non-empty array of subcategories ids")
		//checking for every id is valid mongodb id
		.custom((array) => array.every((id) => mongoose.isValidObjectId(id)))
		.withMessage("Array contains invalid IDs format")
		.bail()
		//check if subCategories ids in the db
		.custom(async (array) => {
			const existingCount = await SubCategory.countDocuments({
				_id: { $in: array },
			});
			if (existingCount !== array.length) {
				throw new AppError("Some subcategories not found");
			}
			return true;
		})
		.bail()
		.custom(async (array, { req }) => {
			const invalidCount = await SubCategory.countDocuments({
				_id: { $in: array },
				category: { $ne: req.body.category },
			});

			if (invalidCount > 0) {
				throw new AppError(
					"Some subcategories don't belong to the specified category",
					400
				);
			}

			return true;
		}),
	check("brand").optional().isMongoId().withMessage("Invalid Brand Id format"),
	check("ratingsAverage")
		.optional()
		.isNumeric()
		.withMessage("ratingsAverage must be a number")
		.bail()
		.isLength({ min: 1 })
		.withMessage("Rating must be above or equal 1.0")
		.bail()
		.isLength({ max: 5 })
		.withMessage("Rating must be below or equal 5.0"),
	check("ratingQuantity")
		.optional()
		.isNumeric()
		.withMessage("ratingsQuantity must be a number"),
	validatorController,
];

exports.getProductValidator = [checkId("Product"), validatorController];

exports.updateProductValidator = [
	checkId("Product"),
	check("title")
		.optional()
		.notEmpty()
		.withMessage("Product title can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Title must be at least 3 characters")
		.bail(),
	check("description")
		.optional()
		.notEmpty()
		.withMessage("Product description can't be empty")
		.bail()
		.isLength({ max: 2000 })
		.withMessage("Too long description"),
	check("quantity")
		.optional()
		.notEmpty()
		.withMessage("Product quantity can't be empty")
		.bail()
		.isNumeric()
		.withMessage("Product quantity must be a number"),
	check("sold")
		.optional()
		.notEmpty()
		.withMessage("Product sold number van't be empty")
		.bail()
		.isNumeric()
		.withMessage("Product sold must be a number"),
	check("price")
		.optional()
		.notEmpty()
		.withMessage("Product price can't be empty")
		.bail()
		.isNumeric()
		.withMessage("Product price must be a number")
		.bail()
		.isLength({ max: 32 })
		.withMessage("Too long product price"),
	check("priceAfterDiscount")
		.optional()
		.notEmpty()
		.withMessage("price after discount can't be empty")
		.bail()
		.isNumeric()
		.withMessage("price after discount must be a number")
		.bail()
		.custom((value, { req }) => {
			if (value >= req.body.price)
				throw new AppError("priceAfterDiscount must be lower than price");
			return true;
		}),
	check("colors")
		.optional()
		.isArray()
		.withMessage("available colors should be array of string"),
	check("imageCover")
		.optional()
		.notEmpty()
		.withMessage("Product image cover can't be empty"),
	check("images")
		.optional()
		.isArray()
		.withMessage("available images should be array of string"),
	check("category")
		.optional()
		.notEmpty()
		.withMessage("Product must belong to category")
		.bail()
		.isMongoId()
		.withMessage("Invalid category ID")
		.bail()
		.custom(async (categoryId) => {
			const category = await Category.findById(categoryId);
			if (!category) throw new AppError("There is no category with this id");
			return true;
		}),
	check("subCategory")
		.optional()
		.isArray({ min: 1 })
		.withMessage("SubCategories must be a non-empty array of subcategories ids")
		//checking for every id is valid mongodb id
		.custom((array) => array.every((id) => mongoose.isValidObjectId(id)))
		.withMessage("Array contains invalid IDs format")
		.bail()
		//check if subCategories ids in the db
		.custom(async (array) => {
			const existingCount = await SubCategory.countDocuments({
				_id: { $in: array },
			});
			if (existingCount !== array.length) {
				throw new AppError("Some subcategories not found");
			}
			return true;
		})
		.bail()
		.custom(async (array, { req }) => {
			const invalidCount = await SubCategory.countDocuments({
				_id: { $in: array },
				category: { $ne: req.body.category },
			});

			if (invalidCount > 0) {
				throw new AppError(
					"Some subcategories don't belong to the specified category",
					400
				);
			}

			return true;
		}),
	check("brand").optional().isMongoId().withMessage("Invalid Brand Id format"),
	check("ratingsAverage")
		.optional()
		.isNumeric()
		.withMessage("ratingsAverage must be a number")
		.bail()
		.isLength({ min: 1 })
		.withMessage("Rating must be above or equal 1.0")
		.bail()
		.isLength({ max: 5 })
		.withMessage("Rating must be below or equal 5.0"),
	check("ratingQuantity")
		.optional()
		.isNumeric()
		.withMessage("ratingsQuantity must be a number"),
	validatorController,
];

exports.deleteProductValidator = [checkId("Product"), validatorController];
