const express = require("express");

const reviewController = require("../controllers/reviewController");
const reviewValidator = require("../utils/validators/reviewValidator");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.post(
		authController.protect,
		authController.restrictTo("user"),
		reviewController.setProductIdAndUserIdToBody,
		reviewValidator.createReviewValidator,
		reviewController.createReview
	)
	.get(
		reviewValidator.getReviewsValidator,
		reviewController.createFilterObj,
		reviewController.getReviews
	);

router
	.route("/:id")
	.get(reviewValidator.getReviewValidator, reviewController.getReview)
	.patch(
		authController.protect,
		authController.restrictTo("user"),
		reviewValidator.updateReviewValidator,
		reviewController.updateReview
	)
	.delete(
		authController.protect,
		authController.restrictTo("user","admin"),
		reviewValidator.deleteReviewValidator,
		reviewController.deleteReview
	);

module.exports = router;
