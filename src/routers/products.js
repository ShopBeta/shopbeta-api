const express = require('express')
const Product = require('../models/products')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

//Create products
router.post('/products', auth, upload.single('images'), async (req, res) => {
    const user = new User(req.body)
    const product = new Product({
        ...req.body,
        owner: req.user._id
    })

    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        product.images = buffer
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }

 },(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

 // Get all global or public products from database
 router.get('/products', async (req, res) => {
    try {
        const product = await Product.find({})
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }
 })

 // Get products via category "/products?category="fashion"
 // Get products via category "/products?limit="50"&ship="50"
 // Get products via "/products?sortBy=createdAt:"desc"
 router.get('/products', async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.category) {
        match.category = req.query.category
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.product.populate({
            path: 'products',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.product)
    } catch (e) {
        res.status(500).send()
    }
})

// Get your product
 router.get('/products/me', auth, async (req, res) => {
    try {
        await req.user.populate('products').execPopulate()
        res.send(req.user.product)
    } catch (e) {
        res.status(500).send()
    }
})


 router.get('/products/:id', async (req, res) => {
     const _id = req.params.id

     try {
         const product = await Product.findById(_id)

         if (!product) {
             return res.status(404).send()
         }

         res.send(product)
     } catch (e) {
        res.status(500).send()
     }

 })

router.delete('/products/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({_id: req.params.id, owner: req.user._id })

        if (!product) {
            res.status(404).send()
        }
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})


// POST hearts
router.post('/product/:id/hearts', auth, async (req, res) => {
   
    const productModel = Product.findById({
        ...req.body,
        _id: req.params.id,
    })

    try {
        const product = await productModel

        if (!product) {
            return res.status(404).send()
        }
        const updates = req.body.heart
        product.heart = updates
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router