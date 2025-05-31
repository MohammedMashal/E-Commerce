const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Brand must have a name"],
			unique: true,
			trim: true,
			lowercase: true,
			minlength: [3, "Too short Brand name"],
			maxlength: [32, "Too long Brand name"],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		image: String,
	},
	{ timestamps: true }
);

brandSchema.pre("save", function (next) {
	if (this.isModified("name")) this.slug = slugify(this.name);
	next();
});
brandSchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	update.slug = slugify(update.name);
	if (update.name) this.setUpdate(update);
	next();
});

module.exports = mongoose.model("Brand", brandSchema);
