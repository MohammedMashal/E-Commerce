const mongoose = require("mongoose");
const slugify = require("slugify");

const subCategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: [true, "SubCategory must be unique"],
			minlength: [2, "Too short subcategory name"],
			maxlength: [32, "Too long subcategory name"],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		category: {
			type: mongoose.Schema.ObjectId,
			ref: "Category",
			required: [true, "SubCategory must belong to a category"],
		},
	},
	{ timestamps: true }
);
subCategorySchema.pre("save", function (next) {
	if (this.isModified("name")) this.slug = slugify(this.name);
	next();
});
subCategorySchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	update.slug = slugify(update.name);
	if (update.name) this.setUpdate(update);
	next();
});
subCategorySchema.pre(/^find/, function (next) {
	this.populate({ path: "category", select: " name" });
	next();
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
