const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Coupon must have a name"],
			unique: true,
		},
		expire: {
			type: Date,
			required: [true, "Coupon must have an expire time"],
		},
		discount: {
			type: Number,
			required: [true, "Coupon must have a discount value"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
