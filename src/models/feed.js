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
            trim: true,
            time: {
                type: Date,
                default: Date.now()
            },
            owner: {
                type: mongoose.Schema.Types.ObjectId,
            }
        },
        file: {
            type: Buffer
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true
        }
    }],
    hearts : {
        type: Number,
        default: 0,
    },
    media: {
        type: Buffer
    },
    time: {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const videoSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
    },
    comments: [{
        text: {
            type: String,
            trim: true,
            time: {
                type: Date,
                default: Date.now()
            },
            owner: {
                type: mongoose.Schema.Types.ObjectId,
            }
        },
        file: {
            type: Buffer
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true
        }
    }],
    hearts : {
        type: Number,
        default: 0,
    },
    views : {
        type: Number,
        default: 0,
    },
    video: {
        type: Buffer
    },
    time: {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Feed = mongoose.model('Feed', feedSchema)
const Video = mongoose.model('Video', videoSchema)

module.exports = {
    Feed,
    Video
}