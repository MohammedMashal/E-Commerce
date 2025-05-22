const asyncHandler = require("express-async-handler");

const AppError = require("../utils/appError");

const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

exports.addProductToCart = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.body.product);
	if (!product)
		return next(new AppError("There is no product with this ID", 404));

	//get cart for logged user
	let cart = await Cart.findOne({ user: req.user._id });

	//if there is no cart create one
	if (!cart) {
		cart = await Cart.create({ user: req.user._id, items: [req.body] });
	} else {
		//check if product exist in cart items
		const productIndex = cart.items.findIndex(
			(item) => item.product.toString() === req.body.product
		);
		if (productIndex < 0) {
			cart.items.push(req.body);
			cart.items[cart.items.length - 1].price = product.price;
		} else {
			cart.items[productIndex].quantity += 1;
		}
		await cart.save();
	}
	res.status(200).json({
		status: "success",
		results: cart.items.length,
		data: {
			cart,
		},
	});
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
	const cart = await Cart.findOne({ user: req.user._id });
	if (!cart) return next(new AppError("There is no cart for this user", 404));

	res.status(200).json({
		status: "success",
		results: cart.items.length,
		data: {
			cart,
		},
	});
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
	await Cart.findOneAndDelete({ user: req.user._id });
	res.status(204).json({
		status: "success",
		data: null,
	});
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
	const coupon = await Coupon.findOne({
		name: req.body.coupon,
		expire: { $gt: Date.now() },
	});
	if (!coupon) return next("coupon is invalid or expired", 404);

	const cart = await Cart.findOne({ user: req.user._id });
	if (!cart) return next(new AppError("There is no cart for this user", 404));

	const { totalPrice } = cart;
	const totalPriceAfterDiscount = (
		totalPrice -
		(totalPrice * coupon.discount) / 100
	).toFixed(2);

	cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
	await cart.save();

	res.status(200).json({
		status: "success",
		results: cart.items.length,
		data: {
			cart,
		},
	});
});

// @desc    Update specific cart item quantity
// @route   patch /api/v1/cart/:id
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
	const cart = await Cart.findOne({ user: req.user._id });
	if (!cart) return next(new AppError("There is no cart for this user", 404));
	const itemIndex = cart.items.findIndex(
		(item) => item.product === req.params.id
	);
	if (itemIndex < 0)
		return next(
			new AppError(`This product ${req.params.id} isn't in the cart`, 404)
		);
	cart.items[itemIndex].quantity = req.body.quantity;
	await cart.save();
	res.status(200).json({
		status: "success",
		results: cart.items.length,
		data: {
			cart,
		},
	});
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:id
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
	const cart = await Cart.findOne({ user: req.user._id });
	if (!cart) return next(new AppError("There is no cart for this user", 404));
	const productIndex = cart.items.findIndex(
		(item) => req.params.id === item.product.toString()
	);
	if (!productIndex)
		return next(new AppError("This item isn't in the cart", 404));

	cart.items.splice(productIndex, 1);
	await cart.save();

	res.status(200).json({
		status: "success",
		results: cart.items.length,
		data: {
			cart,
		},
	});
});
