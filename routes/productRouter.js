const express = require("express");

const productController = require("../controllers/productController");
const productValidator = require("../utils/validators/productValidator");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRouter");

const router = express.Router();

router
	.route("/")
	.post(
		authController.protect,
		authController.restrictTo("admin"),
		productValidator.createProductValidator,
		productController.createProduct
	)
	.get(productController.getProducts);

router
	.route("/:id")
	.get(productValidator.getProductValidator, productController.getProduct)
	.patch(
		authController.protect,
		authController.restrictTo("admin"),
		productValidator.updateProductValidator,
		productController.updateProduct
	)
	.delete(
		authController.protect,
		authController.restrictTo("admin"),
		productValidator.deleteProductValidator,
		productController.deleteProduct
	);
router.use("/:productId/reviews", reviewRouter);

module.exports = router;
