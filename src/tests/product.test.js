const request = require('supertest')
const app = require('../../app')
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
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jordan Nike'
        })
        .expect(201)
    const product = await Product.findById(response.body._id)
    expect(product).not.toBeNull()
    expect(product.completed).toEqual(false)
})

test('Should fetch user products', async () => {
    const response = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users products', async () => {
    const response = await request(app)
        .delete(`/products/${productOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const product = await Product.findById(productOne._id)
    expect(product).not.toBeNull()
})
