const express = require("express");

const authController = require("../controllers/authController");
const couponValidator = require("../utils/validators/couponValidator");
const couponController = require("../controllers/couponController");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("admin"));

router
	.route("/")
	.post(couponValidator.createCouponValidator, couponController.createCoupon)
	.get(couponController.getCoupons);

router
	.route(":id")
	.patch(couponValidator.updateCouponValidator, couponController.updateCoupon)
	.delete(couponValidator.deleteCouponValidator, couponController.deleteCoupon);
module.exports = router;
