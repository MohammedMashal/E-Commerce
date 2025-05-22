const handlerFactory = require("./handlerFactory");

const Category = require("../models/categoryModel");

// @desc    create new category
// @route   Post /api/v1/categories
// @access  private
exports.createCategory = handlerFactory.createOne(Category);

// @desc    get all categories
// @route   Get /api/v1/categories
// @access  public
exports.getCategories = handlerFactory.getAll(Category);

// @desc    get specific category by id
// @route   Get /api/v1/categories/:id
// @access  public
exports.getCategory = handlerFactory.getOne(Category);

// @desc    update specific category by id
// @route   Patch /api/v1/categories/:id
// @access  private
exports.updateCategory = handlerFactory.updateOne(Category);

// @desc    delete specific category by id
// @route   Delete /api/v1/categories/:id
// @access  private
exports.deleteCategory = handlerFactory.deleteOne(Category);
