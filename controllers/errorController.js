const AppError = require("../utils/appError");

const handleJwtInvalidSignature = () =>
	new AppError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
	new AppError("Expired token, please login again..", 401);

const sendErrorDev = (err, res) =>
	res.status(err.statusCode).json({
		status: err.status,
		isOperational: err.isOperational,
		message: err.message,
		stack: err.stack,
	});

const sendErrorProd = (err, res) =>
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";
	if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
	else {
		if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
		if (err.name === "TokenExpiredError") err = handleJwtExpired();
		sendErrorProd(err, res);
	}
};
