const { check } = require("express-validator");

const Product = require("../../models/productModel");

const AppError = require("../appError");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.addProductToWishlistValidator = [
	check("product")
		.notEmpty()
		.withMessage("product can't be empty")
		.bail()
		.isMongoId()
		.withMessage("Invalid product ID format")
		.bail()
		.custom(async (productId) => {
			const product = await Product.findById(productId);
			if (!product) throw new AppError("There is no product with this ID", 400);
			return true;
		}),
	validatorController,
];

exports.removeProductFromWishlistValidator = [
	checkId("Product"),
	validatorController,
];
