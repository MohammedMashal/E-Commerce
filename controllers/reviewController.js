const handlerFactory = require("./handlerFactory");

const Review = require("../models/reviewModel");

exports.setProductIdAndUserIdToBody = (req, res, next) => {
	//nested route (create)
	if (!req.body.product) req.body.product = req.params.productId;
	if (!req.body.user) req.body.user = req.user._id;
	next();
};

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
	let filterObject = {};
	if (req.params.productId) filterObject = { product: req.params.productId };
	req.filterObj = filterObject;
	next();
};

// @desc    create new review
// @route   Post /api/v1/reviews
// @access  private
exports.createReview = handlerFactory.createOne(Review);

// @desc    get all reviews
// @route   Get /api/v1/reviews
// @access  public
exports.getReviews = handlerFactory.getAll(Review);

// @desc    get specific review by id
// @route   Get /api/v1/reviews/:id
// @access  public
exports.getReview = handlerFactory.getOne(Review);

// @desc    update specific review by id
// @route   Patch /api/v1/reviews/:id
// @access  public
exports.updateReview = handlerFactory.updateOne(Review);

// @desc    delete specific review by id
// @route   Delete /api/v1/reviews/:id
// @access  public
exports.deleteReview = handlerFactory.deleteOne(Review);
