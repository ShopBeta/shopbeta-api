const mongoose = require('mongoose')
const Product = require('../models/product')

const cartSchema = new mongoose.Schema(Product)

const Cart = mongoose.model('Product', cartSchema)

module.exports = Cart