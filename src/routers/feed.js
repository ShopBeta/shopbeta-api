const express = require('express')
const Feed = require('../models/feed')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()


router.post('/feed', auth, async (req, res) => {
    const feed = new Feed({
        ...req.body,
        owner: req.user._id
    })

    try {
        feed.save()
        res.status(201).send(feed)
    } catch (e) {
        res.status(400).send(e)
    }

 })

 // Upload profile media file for a feed

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
            return cb(new Error('Please upload a supported file format'))
        }

        cb(undefined, true)
    }
})

router.patch('/feed/:id/upload', auth, upload.single('media'), async (req, res) => {
    const feed = new Feed({
        ...req.body,
        owner: req.user._id
    })
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    feed.media = buffer
    await feed.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

 router.get('/feed', auth, async (req, res) => {
    try {
        const feed = await Feed.find({})
        res.send(feed)
    } catch (e) {
        res.status(500).send(e)
    }
 })

 router.get('/feed/:id', auth, async (req, res) => {
     const _id = req.params.id

     try {
         const feed = await Feed.findById(_id)

         if (!feed) {
             return res.status(404).send()
         }

         res.send(feed)
     } catch (e) {
        res.status(500).send()
     }

 })

router.delete('/feed/:id', auth, async (req, res) => {
    try {
        const feed = await Feed.findByIdAndDelete(req.params.id)

        if (!feed) {
            res.status(404).send()
        }

        res.send(feed)
    } catch (e) {
        res.status(500).send(e)
    }
})

// POST comments
router.patch('/feed/:id/comments', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['comments', 'hearts', 'shares']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const feed = await Feed.findOne({ _id: req.params.id, owner: req.user._id})

        if (!feed) {
            return res.status(404).send()
        }

        updates.forEach((update) => feed[update] = req.body[update])
        await feed.save()
        res.send(feed)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Upload media file as a comment

const upload2 = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
            return cb(new Error('Please upload a supported file format'))
        }

        cb(undefined, true)
    }
})

router.patch('/feed/:id/comments/', auth, upload2.single('file'), async (req, res) => {
    const feed = new Feed({
        ...req.body,
        owner: req.user._id
    })
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    feed.comments.file = buffer
    await feed.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
 
module.exports = router