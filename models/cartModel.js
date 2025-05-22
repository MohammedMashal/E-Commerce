const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
	{
		items: [
			{
				product: {
					type: mongoose.Schema.ObjectId,
					ref: "Product",
					required: true,
				},
				price: Number,
				color: String,
				quantity: {
					type: Number,
					default: 1,
					min: 1,
				},
				addedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		totalPrice: {
			type: Number,
			default: 0,
		},
		totalPriceAfterDiscount: Number,
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

cartSchema.pre("save", function (next) {
	if (this.isModified(this.items))
		this.totalPrice = this.items.reduce(
			(total, item) => total + item.quantity * item.price,
			0
		);
	next();
});

module.exports = mongoose.model("Cart", cartSchema);
