const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc    Add product to wishlist
// @route   Post /api/v1/wishlist
// @access  protected/user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$addToSet: {
				wishlist: req.body.product,
			},
		},
		{ new: true }
	);
	res.status(200).json({
		status: "success",
		data: {
			wishlist: user.wishlist,
		},
	});
});

// @desc    get wishlist
// @route   Get /api/v1/wishlist
// @access  protected/user
exports.getWishlist = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id).populate("wishlist");
	res.status(200).json({
		status: "success",
		results: user.wishlist.length,
		data: {
			wishlist: user.wishlist,
		},
	});
});

// @desc    Delete product from wishlist
// @route   Delete /api/v1/wishlist/id
// @access  protected/user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$pull: {
				wishlist: req.params.id,
			},
		},
		{ new: true }
	);
	res.status(200).json({
		status: "success",
		data: {
			wishlist: user.wishlist,
		},
	});
});
