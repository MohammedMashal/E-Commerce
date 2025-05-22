const { check } = require("express-validator");

const Review = require("../../models/reviewModel");
const Product = require("../../models/productModel");

const AppError = require("../appError");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.createReviewValidator = [
	check("title").notEmpty().withMessage("Review title can't be empty").bail(),
	check("ratings")
		.notEmpty()
		.withMessage("Review rating can't be empty")
		.bail()
		.isFloat({ min: 1 })
		.withMessage("Review rating must be above or equal 1.0")
		.bail()
		.isFloat({ max: 5 })
		.withMessage("Review rating must be below or equal 5.0"),
	check("user")
		.notEmpty()
		.withMessage("Review must have a user")
		.bail()
		.isMongoId()
		.withMessage("Invalid user ID format")
		.bail()
		//check if user id is current user logged in
		.custom((id, { req }) => {
			if (req.user._id !== id)
				throw new AppError("This ID isn't current user logged in ID", 400);
			return true;
		}),
	check("product")
		.isMongoId()
		.withMessage("Invalid product ID format")
		.bail()
		.custom(async (productId) => {
			const product = await Product.findById(productId);
			if (!product) throw new AppError("There is no product with this ID", 400);
			return true;
		})
		//check if current user logged in made a review on the same product before
		.custom(async (productId, { req }) => {
			const review = await Review.findOne({
				user: req.user._id,
				product: productId,
			});
			if (review)
				throw new AppError(
					"You already created a review on this product before",
					400
				);
			return true;
		}),
	validatorController,
];

exports.getReviewValidator = [checkId("Review"), validatorController];

exports.getReviewsValidator = [
	check("productId").optional().isMongoId().withMessage("Invalid Product ID"),
	validatorController,
];

exports.updateReviewValidator = [
	checkId("Review").custom(async (reviewId, { req }) => {
		const review = await Review.findById(reviewId);
		if (review.user._id !== req.user._id)
			throw new AppError("You are not allowed to perform this action", 400);
		return true;
	}),
	validatorController,
];

exports.deleteReviewValidator = [
	checkId("Review").custom(async (reviewId, { req }) => {
		const review = await Review.findById(reviewId);
		if (review.user._id !== req.user._id)
			throw new AppError("You are not allowed to perform this action", 400);
		return true;
	}),
	validatorController,
];
