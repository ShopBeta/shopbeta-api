const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const Product = require('../../models/products')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    username: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    phonenumber: 08168759390,
    avatar: 'tests/fixtures/profile-pic.jpg',
    location: 'Toronto',
    websit: 'www.home.org',
    officialEmail: 'abel@gmail.com',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    username: 'Jess',
    email: 'jess@example.com',
    password: 'myhouse099@@',
    phonenumber: 08089997239,
    avatar: 'tests/fixtures/profile-pic.jpg',
    location: 'Vancouver',
    websit: 'www.about.org',
    officialEmail: 'kane@gmail.com',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const productOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'First task',
    category: 'Health and Sports',
    heart: 23,
    description: 'First product',
    images: 'tests/fixtures/profile-pic.jpg',
    price: 32,
    owner: userOne._id
}

const productTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Second task',
    category: 'Men Clothes',
    heart: 12,
    description: 'Second product',
    images: 'tests/fixtures/profile-pic.jpg',
    price: 33,
    owner: userOne._id
}

const productThree = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Third task',
    category: 'Women Clothes',
    description: 'Third product',
    images: 'tests/fixtures/profile-pic.jpg',
    price: 34,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Product.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Product(productOne).save()
    await new Product(productTwo).save()
    await new Product(productThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    productOne,
    productTwo,
    productThree,
    setupDatabase
}