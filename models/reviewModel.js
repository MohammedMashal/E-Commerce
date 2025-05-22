const mongoose = require("mongoose");

const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Review must have a title"],
		},
		ratings: {
			type: Number,
			required: [true, "Review must have a rating"],
			min: [1, "Rating must be above or equal 1.0"],
			max: [5, "Rating must be below or equal 5.0"],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Review must belong to user"],
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: "Product",
			required: [true, "Review must belong to a product"],
		},
	},
	{ timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
	this.populate({ path: "user", select: "name photo" });
	next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
	const result = await this.aggregate([
		{
			$match: { product: productId },
		},
		{
			_id: "$product",
			avgRatings: { $avg: "$ratings" },
			ratingsQuantity: { $sum: 1 },
		},
	]);
	if (result.length > 0) {
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: result[0].avgRatings,
			ratingsQuantity: result[0].ratingsQuantity,
		});
	} else {
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: 0,
			ratingsQuantity: 0,
		});
	}
};

//update product ratings(avg,quantity) every time a review is added or removed
reviewSchema.post("save", async function () {
	await this.constructor.calcAverageRatings(this.product);
});
reviewSchema.post("remove", async function () {
	await this.constructor.calcAverageRatings(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
