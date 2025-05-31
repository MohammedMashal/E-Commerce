const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const handlerFactory = require("./handlerFactory");
const { uploadMultipleImages } = require("./uploadImageController");

const Product = require("../models/productModel");

exports.uploadProductImages = uploadMultipleImages([
	{ name: "imageCover", maxCount: 1 },
	{ name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
	// 1) Cover image
	if (req.files.imageCover) {
		const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

		await sharp(req.files.imageCover.buffer)
			.resize(2000, 1333)
			.toFormat("jpeg")
			.jpeg({ quality: 95 })
			.toFile(`uploads/product/${imageCoverFileName}`);

		req.body.imageCover = imageCoverFileName;
	}

	// 2) Images
	if (req.files.images) {
		req.body.images = [];

		const arrOfPromisesOfImages = req.files.images.map(async (image, index) => {
			const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

			await sharp(image.buffer)
				.resize(2000, 1333)
				.toFormat("jpeg")
				.jpeg({ quality: 95 })
				.toFile(`uploads/product/${imageName}`);

			req.body.images.push(imageName);
		});
		await Promise.all(arrOfPromisesOfImages);
	}

	next();
});

// @desc    create new product
// @route   Post /api/v1/products
// @access  private
exports.createProduct = handlerFactory.createOne(Product);

// @desc    get all products
// @route   Get /api/v1/products
// @access  public
exports.getProducts = handlerFactory.getAll(Product);

// @desc    get specific product by id
// @route   Get /api/v1/products/:id
// @access  public
exports.getProduct = handlerFactory.getOne(Product);

// @desc    update specific product by id
// @route   Patch /api/v1/products/:id
// @access  private
exports.updateProduct = handlerFactory.updateOne(Product);

// @desc    delete specific product by id
// @route   Delete /api/v1/products/:id
// @access  private
exports.deleteProduct = handlerFactory.deleteOne(Product);
