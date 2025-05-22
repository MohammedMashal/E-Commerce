const handlerFactory = require("./handlerFactory");

const SubCategory = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
	//nested route (create)
	if (!req.body.category) req.body.category = req.params.categoryId;
	next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
	let filterObject = {};
	if (req.params.categoryId) filterObject = { category: req.params.categoryId };
	req.filterObj = filterObject;
	next();
};

// @desc    create new subcategory
// @route   Post /api/v1/subcategories
// @access  private
exports.createSubCategory = handlerFactory.createOne(SubCategory);

// @desc    get all subcategories
// @route   Get /api/v1/subcategories
// @access  public
exports.getSubCategories = handlerFactory.getAll(SubCategory);

// @desc    get specific subcategory by id
// @route   Get /api/v1/subcategories/:id
// @access  public
exports.getSubCategory = handlerFactory.getOne(SubCategory);

// @desc    update specific subcategory by id
// @route   Patch /api/v1/subcategories/:id
// @access  private
exports.updateSubCategory = handlerFactory.updateOne(SubCategory);

// @desc    delete specific subcategory by id
// @route   Delete /api/v1/subcategories/:id
// @access  private
exports.deleteSubCategory = handlerFactory.deleteOne(SubCategory);
