const { validationResult, check, matchedData } = require("express-validator");

const AppError = require("../utils/appError");

exports.validatorController = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		req.body = matchedData(req);
		return next();
	}
	const errMsg = errors
		.array()
		.map((err) => err.msg)
		.join(", ");

	return next(new AppError(errMsg, 400));
};

exports.checkId = (fieldName) =>
	check("id").isMongoId().withMessage(`Invalid ${fieldName} ID format`);
