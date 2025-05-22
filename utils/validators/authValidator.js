const { check } = require("express-validator");

const AppError = require("../appError");

const {
	validatorController,
} = require("../../controllers/validatorController");

exports.signUpValidator = [
	check("name")
		.notEmpty()
		.withMessage("User name can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Too short User name"),
	check("email")
		.notEmpty()
		.withMessage("Email can't be empty")
		.bail()
		.isEmail()
		.withMessage("Invalid email address"),
	check("passwordConfirm")
		.notEmpty()
		.withMessage("Password Confirm can't be empty"),
	check("password")
		.notEmpty()
		.withMessage("password can't be empty")
		.bail()
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters")
		.custom((password, { req }) => {
			if (req.body.passwordConfirm !== password)
				throw new AppError("Password and PasswordConfirm aren't the same",400);
			return true;
		}),
	check("phone")
		.optional()
		.isMobilePhone(["ar-EG"])
		.withMessage(
			"Invalid phone number, The only accepted phone numbers is egy phone numbers"
		),
	check("profileImg").optional(),
	validatorController,
];

exports.loginValidator = [
	check("email")
		.notEmpty()
		.withMessage("Email can't be empty")
		.bail()
		.isEmail()
		.withMessage("Invalid email address"),
	check("password")
		.notEmpty()
		.withMessage("password can't be empty")
		.bail()
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters"),
	validatorController,
];

exports.forgetPasswordValidator = [
	check("email")
		.notEmpty()
		.withMessage("Email can't be empty")
		.bail()
		.isEmail()
		.withMessage("Invalid email address"),
	validatorController,
];

exports.resetPasswordValidator = [
	check("newPasswordConfirm")
		.notEmpty()
		.withMessage("Password Confirm can't be empty"),
	check("newPassword")
		.notEmpty()
		.withMessage("password can't be empty")
		.bail()
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters")
		.custom((password, { req }) => {
			if (req.body.newPasswordConfirm !== password)
				throw new AppError("Password and PasswordConfirm aren't the same",400);
			return true;
		}),
	validatorController,
];
