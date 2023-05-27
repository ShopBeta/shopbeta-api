const express = require('express')
const Cart = require('../models/cart')
const Product = require('../models/products')
const auth = require('../middleware/auth')
const router = new express.Router()

//  Add product to Cart
router.post('/cart/:userId/product/:id', async (req, res) => {
    const cart = new Cart({
        owner: req.params.userId,
    })

    try {
        cart.product = req.params.id

        await cart.save()
        res.status(201).send(cart)
    } catch (e) {
        res.status(400).send(e)
    }

 })

  // Get all user's cart products in cart from database
  router.get('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId

        const cart = await Cart.getProductsByUserId(userId)

        res.send(cart.reverse())
    } catch (e) {
        res.status(500).send(e)
    }
 })
 
 router.get('/cart/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const cart = await Cart.findById(_id)

        if (!cart) {
            return res.status(404).send()
        }

        res.send(cart)
    } catch (e) {
       res.status(500).send()
    }

})

 // Delete product from cart
 router.delete('/cart/:id', auth, async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!cart) {
            res.status(404).send()
        }
         // sendDeleteProductEmail(req.user.email, req.user.name)
        res.send(cart)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router
