const express = require("express");

const brandController = require("../controllers/brandController");
const brandValidator = require("../utils/validators/brandValidator");
const authController = require("../controllers/authController");

const router = express.Router();

router
	.route("/")
	.post(
		authController.protect,
		authController.restrictTo("admin"),
		brandController.uploadBrandImage,
		brandController.resizeBrandImage,
		brandValidator.createBrandValidator,
		brandController.createBrand
	)
	.get(brandController.getBrands);

router
	.route("/:id")
	.get(brandValidator.getBrandValidator, brandController.getBrand)
	.patch(
		authController.protect,
		authController.restrictTo("admin"),
		brandController.uploadBrandImage,
		brandController.resizeBrandImage,
		brandValidator.updateBrandValidator,
		brandController.updateBrand
	)
	.delete(
		authController.protect,
		authController.restrictTo("admin"),
		brandValidator.deleteBrandValidator,
		brandController.deleteBrand
	);

module.exports = router;
