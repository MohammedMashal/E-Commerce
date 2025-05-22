const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const userValidator = require("../utils/validators/userValidator");

const router = express.Router();

router.use(authController.protect);

router
	.route("/me")
	.get(userController.getLoggedUserData, userController.getUser);
router
	.route("/changeMyPassword")
	.patch(
		userController.updateLoggedUserPassword,
		userValidator.changeUserPasswordValidator,
		userController.changeUserPassword
	);
router.route("/myReviews").get(userController.getLoggedUserReviews);
router
	.route("/updateMe")
	.patch(
		userController.updateLoggedUserData,
		userValidator.updateUserValidator,
		userController.uploadUserImage,
		userController.resizeImage,
		userController.updateUser
	);

router.route("/deleteMe").delete(userController.deleteLoggedUser);

router.use(authController.restrictTo("admin"));

router.patch(
	"/changePassword/:id",
	userValidator.changeUserPasswordValidator,
	userController.changeUserPassword
);
router
	.route("/")
	.post(
		userValidator.createUserValidator,
		userController.uploadUserImage,
		userController.resizeImage,
		userController.createUser
	)
	.get(userController.getUsers);

router
	.route("/:id")
	.get(userValidator.getUserValidator, userController.getUser)
	.patch(
		userValidator.updateUserValidator,
		userController.uploadUserImage,
		userController.resizeImage,
		userController.updateUser
	)
	.delete(userValidator.deleteUserValidator, userController.deleteUser);

module.exports = router;
