const express = require("express");

const router = express.Router({ mergeParams: true });

const subCategoryController = require("../controllers/subCategoryController");
const subCategoryValidator = require("../utils/validators/subCategoryValidator");
const authController = require("../controllers/authController");

router
	.route("/")
	.post(
		authController.protect,
		authController.restrictTo("admin"),
		subCategoryController.setCategoryIdToBody,
		subCategoryValidator.createSubCategoryValidator,
		subCategoryController.createSubCategory
	)
	.get(
		subCategoryValidator.getSubCategoriesValidator,
		subCategoryController.createFilterObj,
		subCategoryController.getSubCategories
	);

router
	.route("/:id")
	.get(
		subCategoryValidator.getSubCategoryValidator,
		subCategoryController.getSubCategory
	)
	.patch(
		authController.protect,
		authController.restrictTo("admin"),
		subCategoryValidator.updateSubCategoryValidator,
		subCategoryController.updateSubCategory
	)
	.delete(
		authController.protect,
		authController.restrictTo("admin"),
		subCategoryValidator.deleteSubCategoryValidator,
		subCategoryController.deleteSubCategory
	);

module.exports = router;
