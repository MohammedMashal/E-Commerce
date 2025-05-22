const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const User = require("../models/userModel");

const Email = require("../utils/email");
const AppError = require("../utils/appError");

// @desc    create and send the token
const createAndSendToken = (res, user, statusCode) => {
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	// remove user password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

// @desc    Signup
// @route   Post /api/v1/auth/signup
// @access  public
exports.signup = asyncHandler(async (req, res, next) => {
	//1- create user
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	});
	const url = `${req.protocol}://${req.get("host")}/me`;
	await new Email(user, url).sendWelcome();

	//2-generate token and send it
	createAndSendToken(res, user, 201);
});

// @desc    Login
// @route   Post /api/v1/auth/login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
	// check if email and password exists in the body => (validation layer)
	// check if user exist and the password is correct
	const { email, password } = req.body;
	const user = await User.findOne({ email }).select("+password");
	if (!user || !(await user.correctPassword(password)))
		return next(new AppError("Incorrect email or password", 401));
	// if everything is correct, send token
	createAndSendToken(res, user, 200);
});

// @desc Make sure that user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
	// 1- check if token exist
	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith("Bearer")
	)
		return next(
			new AppError("you are not logged in please log in to get access", 401)
		);
	const token = req.headers.authorization.split(" ")[1];
	// 2- verify token
	const { userId, iat } = jwt.verify(token, process.env.JWT_SECRET_KEY);
	// 3- check if user exist
	const currentUser = await User.findById(userId);
	if (!currentUser)
		return next(
			new AppError(
				"The user that belongs to this token does no longer exist",
				401
			)
		);
	// 4- check if user change his password after token created
	if (currentUser.passwordChangedAfterToken(iat))
		return next(
			new AppError(
				"User recently has changed his password, Please log in again",
				401
			)
		);
	req.user = currentUser;
	next();
});

// @desc Authorization (user permissions)
exports.restrictTo = (...roles) =>
	asyncHandler(async (req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(
				new AppError("You don't have permission to perform this action", 403)
			);
		next();
	});

// @desc    Forget Password
// @route   Post /api/v1/auth/forgetPassword
// @access  public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
	// 1- Get user by email
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) return next(new AppError("There is no user with this email", 404));

	// 2- if user exist, Generate random reset code and save it in db
	const resetCode = user.generatePasswordResetCode();
	await user.save();

	// 3 - send reset code via email
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/resetpassword/${resetCode}`;
	try {
		await new Email(user, resetURL).sendResetPassword();

		res.status(200).json({
			status: "success",
			message: "Reset url has sent to email",
		});
	} catch (error) {
		user.passwordResetCode = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		return next(
			new AppError(
				"Something went wrong in sending email, Please try again later",
				500
			)
		);
	}
});

// @desc    Reset Password
// @route   Post /api/v1/auth/resetPassword
// @access  public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// 1) Get user based on the token
	const hashedCode = crypto
		.createHash("sha256")
		.update(req.params.code)
		.digest("hex");

	const user = await User.findOne({
		passwordResetCode: hashedCode,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError("URL is invalid or has expired", 400));
	}
	user.password = req.body.newPassword;
	user.passwordConfirm = req.body.newPasswordConfirm;
	user.passwordResetCode = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	// 3) Log the user in, send JWT
	createAndSendToken(res, user, 200);
});
