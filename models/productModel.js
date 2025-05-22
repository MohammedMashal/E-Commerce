const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Product title is required"],
			trim: true,
			minlength: [3, "Too short product title"],
			maxlength: [100, "Too long product title"],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: String,
			required: [true, "Product must have a description"],
			minlength: [20, "Too short product description"],
		},
		quantity: {
			type: Number,
			required: [true, "Product must have a quantity"],
		},
		sold: {
			//how many times it has been sold
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, "Product price is required"],
			trim: true,
		},
		priceAfterDiscount: Number,
		colors: [String],
		imageCover: {
			type: String,
			required: [true, "Product image cover is required"],
		},
		images: [String],
		category: {
			type: mongoose.Schema.ObjectId,
			ref: "Category",
			required: [true, "Product must belong to category"],
		},
		subCategory: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "SubCategory",
			},
		],
		brand: {
			type: mongoose.Schema.ObjectId,
			ref: "Brand",
		},
		ratingsAverage: {
			type: Number,
			min: [1, "Rating must be above or equal to 1.0"],
			max: [5, "Rating must be below or equal to 5.0"],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

productSchema.pre("save", function (next) {
	if (this.isModified("name")) this.slug = slugify(this.name);
	next();
});
productSchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	update.slug = slugify(update.name);
	if (update.name) this.setUpdate(update);
	next();
});

module.exports = mongoose.model("Product", productSchema);
