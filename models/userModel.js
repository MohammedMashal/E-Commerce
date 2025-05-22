const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "User must have a name"],
		},
		email: {
			type: String,
			required: [true, "User must have email"],
			unique: [true, "This email is exist"],
		},
		phone: String,
		profileImg: {
			type: String,
			default: "default.jpeg",
		},
		password: {
			type: String,
			required: [true, "password is required"],
			minlength: [8, "Too short password"],
			select: false,
		},
		passwordChangedAt: Date,
		passwordResetCode: String,
		passwordResetExpires: Date,
		wishlist: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Product",
			},
		],
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

//only get active users when querying
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

//hash password whenever the password changes and update passwordChangedAt field
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

//method for comparing user password and input password
userSchema.methods.correctPassword = async function (inputPassword) {
	return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.passwordChangedAfterToken = function (JWTTimeStamp) {
	const passwordChangedAtTimeStamp = parseInt(
		this.passwordChangedAt.getTime() / 1000,
		10
	);
	return JWTTimeStamp < passwordChangedAtTimeStamp;
};

userSchema.methods.generatePasswordResetCode = function () {
	const resetCode = crypto.randomBytes(32).toString("hex");
	this.passwordResetCode = crypto
		.createHash("sha256")
		.update(resetCode)
		.digest("hex");

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetCode;
};

module.exports = mongoose.model("User", userSchema);
