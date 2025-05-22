const express = require("express");

const subCategoryRouter = require("./subCategoryRouter");
const categoryController = require("../controllers/categoryController");
const CategoryValidator = require("../utils/validators/categoryValidator");
const authController = require("../controllers/authController");

const router = express.Router();

router
	.route("/")
	.post(
		authController.protect,
		authController.restrictTo("admin"),
		CategoryValidator.createCategoryValidator,
		categoryController.createCategory
	)
	.get(categoryController.getCategories);

router
	.route("/:id")
	.get(CategoryValidator.getCategoryValidator, categoryController.getCategory)
	.patch(
		authController.protect,
		authController.restrictTo("admin"),
		CategoryValidator.updateCategoryValidator,
		categoryController.updateCategory
	)
	.delete(
		authController.protect,
		authController.restrictTo("admin"),
		CategoryValidator.deleteCategoryValidator,
		categoryController.deleteCategory
	);

router.use("/:categoryId/subcategories", subCategoryRouter);
module.exports = router;
