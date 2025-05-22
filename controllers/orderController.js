const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const handlerFactory = require("./handlerFactory");
const AppError = require("../utils/appError");

// @desc    create cash order(offline payments)
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
	// 1) Get cart depend on cartId
	const cart = await Cart.findById(req.params.id);
	if (!cart) return next(new AppError("There is no cart with this ID", 404));

	// 2) Get order price depend on cart price "Check if coupon apply"
	const totalOrderPrice = cart.totalPriceAfterDiscount
		? cart.totalPriceAfterDiscount
		: cart.totalPrice;

	// 3) Create order with default paymentMethodType cash
	const order = await Order.create({
		user: req.user._id,
		items: cart.items,
		shippingAddress: req.body.shippingAddress,
		totalOrderPrice,
	});
	// 4) After creating order, decrement product quantity, increment product sold
	if (order) {
		const bulkOption = cart.items.map((item) => ({
			updateOne: {
				filter: { _id: item.product },
				update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
			},
		}));
		await Product.bulkWrite(bulkOption);

		// 5) Clear cart depend on cartId
		await Cart.findByIdAndDelete(req.params.id);
	}
	res.status(201).json({
		status: "success",
		data: {
			order,
		},
	});
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
	if (req.user.role === "user") req.filterObj = { user: req.user._id };
	next();
});

// @desc    Get all orders
// @route   get /api/v1/orders
// @access  Protected/User-Admin
exports.getAllOrders = handlerFactory.getAll(Order);

// @desc    Get specific order by ID
// @route   get /api/v1/orders/id
// @access  Protected/Admin
exports.getSpecificOrder = handlerFactory.getOne(Order);

// @desc    Update order paid status to paid
// @route   patch /api/v1/orders/:id/pay
// @access  Protected/Admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(
		req.params.id,
		{
			isPaid: true,
			paidAt: Date.now(),
		},
		{
			new: true,
		}
	);
	if (!order) return next(new AppError("There is no order with this ID", 404));
	res.status(200).json({
		status: "success",
		data: {
			order,
		},
	});
});

// @desc    Update order delivered status
// @route   patch /api/v1/orders/:id/deliver
// @access  Protected/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(
		req.params.id,
		{
			isDelivered: true,
			deliveredAt: Date.now(),
		},
		{ new: true }
	);
	if (!order) return next(new AppError("There is no order with this ID", 404));
	res.status(200).json({
		status: "success",
		data: {
			order,
		},
	});
});

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
	// 1) Get cart depend on cartId
	const cart = await Cart.findOne({ user: req.user._id });
	if (!cart) return next(new AppError("There is no cart with this ID", 404));

	// 2) Get order price depend on cart price "Check if coupon apply"
	const totalOrderPrice = cart.totalPriceAfterDiscount
		? cart.totalPriceAfterDiscount
		: cart.totalPrice;
	// 3) Create stripe checkout session
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				name: req.user.name,
				amount: totalOrderPrice * 100,
				currency: "EGP",
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${req.protocol}://${req.get("host")}/orders`,
		cancel_url: `${req.protocol}://${req.get("host")}/cart`,
		customer_email: req.user.email,
		client_reference_id: req.params.cartId,
		metadata: req.body.shippingAddress,
	});
	res.status(200).json({
		status: "success",
		data: {
			session,
		},
	});
});

const createCardOrder = asyncHandler(async (session) => {
	const cartId = session.client_reference_id;
	const shippingAddress = session.metadata;
	const orderPrice = session.amount_total / 100;

	const cart = await Cart.findById(cartId);
	const user = await User.findOne({ email: session.customer_email });

	const order = await Order.create({
		user: user._id,
		items: cart.items,
		shippingAddress,
		totalOrderPrice: orderPrice,
		isPaid: true,
		paidAt: Date.now(),
		paymentMethodType: "card",
	});

	if (order) {
		const bulkOption = cart.cartItems.map((item) => ({
			updateOne: {
				filter: { _id: item.product },
				update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
			},
		}));
		await Product.bulkWrite(bulkOption, {});

		await Cart.findByIdAndDelete(cartId);
	}
	return order;
});

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
	const sig = req.headers["stripe-signature"];
	let event;
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: `Webhook error : ${error.message}`,
		});
	}
	let order;
	if (event.type === "checkout.session.completed")
		order = await createCardOrder(event.data.object);
	res.status(201).json({
		status: "success",
		data: {
			order,
		},
	});
});
