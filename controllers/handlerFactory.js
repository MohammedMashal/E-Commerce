const asyncHandler = require("express-async-handler");

const AppError = require("../utils/appError");
const APIFeatures = require("../utils/APIFeatures");

exports.createOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const newDoc = await Model.create(req.body);
		res.status(201).json({
			status: "success",
			data: { newDoc },
		});
	});

exports.getAll = (Model) =>
	asyncHandler(async (req, res, next) => {
		let filterObj = {};
		if (req.filterObj) ({ filterObj } = req);
		const features = new APIFeatures(Model.find(filterObj), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();
		const docs = await features.query;
		res.status(200).json({
			status: "success",
			results: docs.length,
			data: { docs },
		});
	});

exports.getOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const doc = await Model.findById(req.params.id);
		if (!doc) return next(new AppError("There is no item with this id", 404));

		res.status(200).json({
			status: "success",
			data: { doc },
		});
	});

exports.updateOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!doc) return next(new AppError("There is no item with this id", 404));

		res.status(200).json({
			status: "success",
			data: { doc },
		});
	});

exports.deleteOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) return next(new AppError("There is no item with this id", 404));

		res.status(204).json({
			status: "success",
			data: null,
		});
	});
