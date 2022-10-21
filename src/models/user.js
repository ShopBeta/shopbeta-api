const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Product = require('./products')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLenght: 15,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLenght: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    phonenumber: {
        type: Number,
        trim: true,
        required: true
    },
    bio: {
        type: String,
        minLenght: 150
    },
    hearts: {
        type: Number,
        default: 0
    },
    follow: {
        type: Boolean,
        default: false
    },
    followers: [{
        type: Object,
        default: 0
    }],
    room: {
        type: String,
        trim: true,
        validate(value) {
            value.toLowerCase()
        }
    },
    location: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
        validate(value) {
           return value.toLowerCase()
        }
    }, 
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    token: [{
        token: {
            type: String,
            required: true,
        }
        
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('feed', {
    ref: 'Feed',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.token
    delete userObject.avatar
    // delete userObject.follow
    // delete userObject.followers

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET)

    user.token = user.token.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user products when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Product.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema )

module.exports = User