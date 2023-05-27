const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    product: {
        type: Object
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

cartSchema.statics.getProductsByUserId = async function (userId) {
    try {
      const products = await this.find({ owner: { $all: [userId] } });
      return products;
    } catch (error) {
      throw error;
    }
  }

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart