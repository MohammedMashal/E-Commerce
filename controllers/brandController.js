const handlerFactory = require("./handlerFactory");

const Brand = require("../models/brandModel");

// @desc    create new brand
// @route   Post /api/v1/brands
// @access  private
exports.createBrand = handlerFactory.createOne(Brand);

// @desc    get all brands
// @route   Get /api/v1/brands
// @access  public
exports.getBrands = handlerFactory.getAll(Brand);

// @desc    get specific brand by id
// @route   Get /api/v1/brands/:id
// @access  public
exports.getBrand = handlerFactory.getOne(Brand);

// @desc    update specific brand by id
// @route   Patch /api/v1/brands/:id
// @access  private
exports.updateBrand = handlerFactory.updateOne(Brand);

// @desc    delete specific brand by id
// @route   Delete /api/v1/brands/:id
// @access  private
exports.deleteBrand = handlerFactory.deleteOne(Brand);
