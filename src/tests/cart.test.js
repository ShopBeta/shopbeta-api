const request = require('supertest')
const app = require('../app')
const Cart = require('../models/cart')
const {
    userOne,
    userTwo,
    productOne,
    cartOne,
    cartTwo,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create cart item for user', async () => {
    const response = await request(app)
        .post('/cart')
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send({
            product: productOne
        })
        .expect(201)
    const cart = await Cart.findById(response.body._id)
    expect(cart).not.toBeNull()
})

test('Should fetch user products', async () => {
    const response = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send()
        .expect(200)
})

test('Should delete cart item for user', async () => {
   const response = await request(app)
        .delete(`/cart/${cartOne._id}`)
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send()
        .expect(200)
    const cart = await Cart.findById(cartOne._id)
    expect(cart).toBeNull()
})

test('Should not delete other users cart items', async () => {
    const response = await request(app)
        .delete(`/cart/${cartTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.token[0].token}`)
        .send()
        .expect(404)
    const cart = await Cart.findById(cartTwo._id)
    expect(cart).not.toBeNull()
})
