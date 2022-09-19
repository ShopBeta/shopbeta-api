const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const Product = require('../../models/products')
const Feed = require('../../models/feed')
const Cart = require('../../models/cart')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    username: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    phonenumber: '08168759390',
    avatar: 'tests/fixtures/profile-pic.jpg',
    location: 'Toronto',
    websit: 'www.home.org',
    contactEmail: 'abel@gmail.com',
    token: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    username: 'Jess',
    email: 'jess@example.com',
    password: 'myhouse099@@',
    phonenumber: '08089997239',
    avatar: 'tests/fixtures/profile-pic.jpg',
    location: 'Vancouver',
    websit: 'www.about.org',
    contactEmail: 'kane@gmail.com',
    token: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const productOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'First task',
    category: 'Health and Sports',
    heart: '45',
    rating: '4.5',
    description: 'First product',
    images: 'tests/fixtures/profile-pic.jpg',
    price: 32,
    owner: userOne._id
}

const productTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Second task',
    category: 'Men Clothes',
    heart: '45',
    rating: '4.5',
    description: 'Second product',
    images: 'tests/fixtures/profile-pic.jpg',
    price: 33,
    owner: userOne._id
}

const productThree = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Third task',
    heart: '45',
    rating: '4.5',
    category: 'Women Clothes',
    description: 'Third product',
    images: 'tests/fixtures/profile-pic.jpg',
    price: 34,
    owner: userTwo._id
}

const feedOne = {
    _id: new mongoose.Types.ObjectId(),
    text: 'First task decription',
    hearts: '36',
    comments: [{
        text: 'First task comment',
        file: 'tests/fixtures/profile-pic.jpg'
    }],
    media: 'tests/fixtures/profile-pic.jpg',
    owner: userOne._id
}

const feedTwo = {
    _id: new mongoose.Types.ObjectId(),
    text: 'Second task decription',
    hearts: '45',
    comments: [{
        text: 'Second task comment',
        file: 'tests/fixtures/profile-pic.jpg'
    }],
    media: 'tests/fixtures/profile-pic.jpg',
    owner: userTwo._id
}

const feedThree = {
    _id: new mongoose.Types.ObjectId(),
    text: 'Third task decription',
    hearts: '53',
    comments: [{
        text: 'Third task comment',
        file: 'tests/fixtures/profile-pic.jpg'
    }],
    media: 'tests/fixtures/profile-pic.jpg',
    owner: userTwo._id
}


const cartOne = {
    _id: new mongoose.Types.ObjectId(),
    product: userOne,
    owner: userOne._id
}

const cartTwo = {
    _id: new mongoose.Types.ObjectId(),
    product: userTwo,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Product.deleteMany()
    await Cart.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Product(productOne).save()
    await new Product(productTwo).save()
    await new Product(productThree).save()
    await new Feed(feedOne).save()
    await new Feed(feedTwo).save()
    await new Feed(feedThree).save()
    await new Cart(cartOne).save()
    await new Cart(cartTwo).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    productOne,
    productTwo,
    productThree,
    feedOne,
    feedTwo,
    feedThree,
    cartOne,
    cartTwo,
    setupDatabase
}