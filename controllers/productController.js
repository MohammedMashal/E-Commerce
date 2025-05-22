const handlerFactory = require("./handlerFactory");

const Product = require("../models/productModel");

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
