const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new AppError("Not an image! Please upload only images", 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.uploadSingleImage = (fieldname) => upload.single(fieldname);

exports.uploadMultipleImages = (arrOfFields) => upload.fields(arrOfFields);

exports.resizeImage = (modelName, fieldName) =>
	asyncHandler(async (req, res, next) => {
		const fileName = `${modelName}-${uuidv4()}-${Date.now()}.jpeg`;

		if (!req.file) return next();

		await sharp(req.file.buffer)
			.resize(600, 600)
			.toFormat("jpeg")
			.jpeg({ quality: 95 })
			.toFile(`uploads/${modelName}/${fileName}`);
		req.body[fieldName] = fileName;
		next();
	});
