const express = require('express')
const Product = require('../models/products')
const { sendNewProductEmail, sendDeleteProductEmail } = require('../emails/account')
const router = new express.Router()

//Add product to Cart
router.post('/cart', auth, async (req, res) => {
    const user = new User(req.body)
    const product = new Product({
        ...req.body,
        owner: req.user._id
    })

    try {
        await product.save()
        // sendNewProductEmail(user.email, user.name)
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }

 })


  // Get all products in cart from database
  router.get('/cart', async (req, res) => {
    try {
        const product = await Product.find({})
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }
 })

 router.delete('/cart/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!product) {
            res.status(404).send()
        }

        res.send(product)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
