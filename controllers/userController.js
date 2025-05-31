const asyncHandler = require("express-async-handler");

const { uploadSingleImage, resizeImage } = require("./uploadImageController");

const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");

const User = require("../models/userModel");
const Review = require("../models/reviewModel");

//uploading user photo to memory storage
exports.uploadUserImage = uploadSingleImage("profileImg");

//Image processing
exports.resizeUserImage = resizeImage("user", "profileImg");

// @desc    create new user
// @route   Post /api/v1/users
// @access  private
exports.createUser = handlerFactory.createOne(User);

// @desc    get all users
// @route   Get /api/v1/users
// @access  private
exports.getUsers = handlerFactory.getAll(User);

// @desc    get specific user by id
// @route   Get /api/v1/users/:id
// @access  private
exports.getUser = handlerFactory.getOne(User);

// @desc    update specific user by id
// @route   Patch /api/v1/users/:id
// @access  private
exports.updateUser = asyncHandler(async (req, res, next) => {
	const filterObj = {};
	if (req.body.name) filterObj.name = req.body.name;
	if (req.body.phone) filterObj.phone = req.body.phone;
	if (req.body.email) filterObj.email = req.body.email;
	if (req.body.profileImg) filterObj.profileImg = req.body.profileImg;

	const document = await User.findByIdAndUpdate(req.params.id, filterObj, {
		new: true,
	});

	if (!document) {
		return next(new AppError(`No item for this id ${req.params.id}`, 404));
	}
	res.status(200).json({
		status: "success",
		data: document,
	});
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id).select("+password");
	if (!user) {
		return next(new AppError("No item for this id", 404));
	}

	if (!(await user.correctPassword(req.body.currentPassword))) {
		return next(new AppError("User current password is wrong", 401));
	}

	user.password = req.body.newPassword;
	await user.save();

	user.password = undefined;

	res.status(200).json({
		status: "success",
		data: user,
	});
});

// @desc    delete specific user by id
// @route   Delete /api/v1/users/:id
// @access  private
exports.deleteUser = handlerFactory.deleteOne(User);

// @desc    get logged user data
// @route   Get /api/v1/users/me
// @access  private
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
	req.params.id = req.user._id;
	next();
});

// @desc    get logged user data
// @route   patch /api/v1/users/changeMyPassword
// @access  private
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
	req.params.id = req.user._id;
	next();
});

// @desc    get logged user data
// @route   patch /api/v1/users/updateMe
// @access  private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
	req.params.id = req.user._id;
	next();
});

// @desc    delete logged user
// @route   delete /api/v1/users/deleteMe
// @access  private
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.user._id, { active: false });
	if (!user) return next(new AppError("There is no item with this id", 404));

	res.status(204).json({
		status: "success",
		data: null,
	});
});

// @desc    get logged user reviews
// @route   get /api/v1/users/myReviews
// @access  private
exports.getLoggedUserReviews = asyncHandler(async (req, res, next) => {
	//need to add api features here
	const reviews = await Review.find({ user: req.user._id }).select("-user");
	res.status(200).json({
		status: "success",
		results: reviews.length,
		data: {
			reviews,
		},
	});
});
