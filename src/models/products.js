const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 12,
        required: true,
    },
    heart: {
        type: Number
    },
    images: {
        type: Buffer,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 3.7
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)



module.exports = Product