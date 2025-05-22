const express = require("express");

const authController = require("../controllers/authController");
const authValidator = require("../utils/validators/authValidator");
const userController = require("../controllers/userController");

const router = express.Router();

router
	.route("/signup")
	.post(
		authValidator.signUpValidator,
		userController.uploadUserImage,
		userController.resizeImage,
		authController.signup
	);
router.route("/login").post(authValidator.loginValidator, authController.login);
router
	.route("/forgetPassword")
	.post(authValidator.forgetPasswordValidator, authController.forgetPassword);
router
	.route("/resetPassword/:code")
	.patch(authValidator.resetPasswordValidator, authController.resetPassword);
	
module.exports = router;
