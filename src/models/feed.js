const mongoose = require('mongoose')
// const validator = require('validator')

const feedSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
    },
    comments: [{
        text: {
            type: String,
            trim: true
        },
        file: {
            type: Buffer
        }
    }],
    hearts : {
        type: Number,
        default: 0,
    },
    media: [{
        type: Buffer
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Feed = mongoose.model('Feed', feedSchema)

module.exports = Feed