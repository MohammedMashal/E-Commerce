const express = require("express");

const reviewController = require("../controllers/reviewController");
const reviewValidator = require("../utils/validators/reviewValidator");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
	.route("/admin")
	.get(authController.restrictTo("admin"), reviewController.getReviews);

router
	.route("/")
	.post(
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
	.patch(reviewValidator.updateReviewValidator, reviewController.updateReview)
	.delete(reviewValidator.deleteReviewValidator, reviewController.deleteReview);

module.exports = router;
