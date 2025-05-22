const handlerFactory = require("./handlerFactory");

const Coupon = require("../models/couponModel");

// @desc    create new coupon
// @route   Post /api/v1/coupons
// @access  private
exports.createCoupon = handlerFactory.createOne(Coupon);

// @desc    get all coupons
// @route   Get /api/v1/coupons
// @access  private
exports.getCoupons = handlerFactory.getAll(Coupon);

// @desc    get specific coupon by id
// @route   Get /api/v1/coupons/:id
// @access  private
exports.getCoupon = handlerFactory.getOne(Coupon);

// @desc    update specific coupon by id
// @route   Patch /api/v1/coupons/:id
// @access  private
exports.updateCoupon = handlerFactory.updateOne(Coupon);

// @desc    delete specific coupon by id
// @route   Delete /api/v1/coupons/:id
// @access  private
exports.deleteCoupon = handlerFactory.deleteOne(Coupon);
