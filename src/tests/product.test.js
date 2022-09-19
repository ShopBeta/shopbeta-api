const request = require('supertest')
const app = require('../app')
const Product = require('../models/products')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    productOne,
    productTwo,
    productThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create product for user', async () => {
    const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send({
            name: 'Jordan Nike',
            description: 'having a prommo',
            heart: '0',
            rating: '3.7',
            price: '26',
            category: 'Men clothing',
            images: 'tests/fixtures/profile-pic.jpg'
        })
        .expect(201)
    const product = await Product.findById(response.body._id)
    expect(product).not.toBeNull()
    expect(product.images).toEqual(expect.any(Buffer))
})

test('Should fetch user products', async () => {
    const response = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send()
        .expect(200)
})

test('Should update product for user', async () => {
    const response = await request(app)
        .post(`/product/${productThree._id}/heart`)
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send({
            heart: '67'
        })
        .expect(201)
    const product = await Product.findById(productThree._id)
    expect(product).not.toBeNull()
})
