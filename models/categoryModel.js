const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Category must have a name"],
			unique: [true, "Category must be unique"],
			minlength: [3, "Too short category name"],
			maxlength: [32, "Too long category name"],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		image: String,
	},
	{ timestamps: true }
);
categorySchema.pre("save", function (next) {
	if (this.isModified("name")) this.slug = slugify(this.name);
	next();
});
categorySchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	update.slug = slugify(update.name);
	if (update.name) this.setUpdate(update);
	next();
});

module.exports = mongoose.model("Category", categorySchema);
