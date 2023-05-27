const express = require('express')
const Product = require('../models/products')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { DeleteProductEmail } = require('../emails/account')
const router = new express.Router()


const imageUploads = multer({
    limits: {
        fileSize: 100000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

//  Create products
router.post('/products/:id', imageUploads.array('images', 4), async (req, res) => {
    const product = new Product({
        ...req.body,
        owner: req.params.id
    })        
   
    try {
        const buffer = await req.files
        product.images = buffer
        
        await product.save()
        res.redirect('https://shopbeta-online.onrender.com/assets/vendor/MarketPlace')
        // res.status(201).send(product)
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
        res.send(product.reverse())
    } catch (e) {
        res.status(500).send(e)
    }
 })

 router.get('/products/:id/images-1', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
       
        if (!product || !product.images) {
            throw new Error()
        }

        const image = await sharp(product.images[0].buffer.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        res.set('Content-Type', 'image/jpg')
        res.send(image)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/products/:id/images-2', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
       
        if (!product || !product.images) {
            throw new Error()
        }

        const image = await sharp(product.images[1].buffer.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        res.set('Content-Type', 'image/jpg')
        res.send(image)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/products/:id/images-3', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
       
        if (!product || !product.images) {
            throw new Error()
        }

        const image = await sharp(product.images[2].buffer.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        res.set('Content-Type', 'image/jpg')
        res.send(image)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/products/:id/images-4', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
       
        if (!product || !product.images) {
            throw new Error()
        }

        const image = await sharp(product.images[3].buffer.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        res.set('Content-Type', 'image/jpg')
        res.send(image)
    } catch (e) {
        res.status(404).send()
    }
})

// get user's personal products
router.get('/products/:userId', async (req, res) => {
    try {
        const userId = req.params.userId

        const product = await Product.getProductsByUserId(userId)

        res.send(product)
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

        // DeleteProductEmail()
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})


// POST hearts
router.post('/product/:id/hearts', async (req, res) => {
   
    const  _id = req.params.id

    const productModel = Product.findById(_id)

    try {
        const product = await productModel

        if (!product) {
            return res.status(404).send()
        }

        const updates = req.body.heart
        product.heart = updates
        
        await product.save()
        res.status(200).send(product.heart)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router