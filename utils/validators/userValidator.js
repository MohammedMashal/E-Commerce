const { check } = require("express-validator");

const AppError = require("../appError");

const {
	validatorController,
	checkId,
} = require("../../controllers/validatorController");

exports.createUserValidator = [
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
				throw new AppError("Password and PasswordConfirm aren't the same");
			return true;
		}),
	check("phone")
		.optional()
		.isMobilePhone(["ar-EG"])
		.withMessage(
			"Invalid phone number, The only accepted phone numbers is egy phone numbers"
		),
	check("profileImg").optional(),
	check("role").optional(),
	validatorController,
];

exports.getUserValidator = [checkId("User"), validatorController];

exports.updateUserValidator = [
	checkId("User"),
	check("name")
		.optional()
		.notEmpty()
		.withMessage("User name can't be empty")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Too short User name"),
	check("email")
		.optional()
		.notEmpty()
		.withMessage("Email can't be empty")
		.bail()
		.isEmail()
		.withMessage("Invalid email address"),
	check("phone")
		.optional()
		.isMobilePhone(["ar-EG"])
		.withMessage(
			"Invalid phone number, The only accepted phone numbers is egy phone numbers"
		),
	check("profileImg").optional(),
	check("role").optional(),
	validatorController,
];

exports.changeUserPasswordValidator = [
	checkId("User"),
	check("currentPassword")
		.notEmpty()
		.withMessage("current password can't be empty"),
	check("newPassword")
		.notEmpty()
		.withMessage("The new password can't be empty"),
	check("newPasswordConfirm")
		.notEmpty()
		.withMessage("The new password confirm can't be empty")
		.bail()
		.custom((value, { req }) => {
			if (value !== req.body.newPassword)
				throw new AppError(
					"newPassword and newPasswordConfirm aren't the same",
					400
				);
			return true;
		}),
	validatorController,
];

exports.deleteUserValidator = [checkId("User"), validatorController];
